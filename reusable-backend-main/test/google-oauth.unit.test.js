import test, { afterEach } from "node:test";
import assert from "node:assert/strict";

import { OAuth2Client } from "google-auth-library";
import { User } from "../src/models/user.model.js";
import { Role } from "../src/models/role.model.js";
import { Setting } from "../src/models/setting.model.js";
import EmailService from "../src/service/email.service.js";
import { ApiError } from "../src/utils/ApiError.js";
import { verifyGoogleCredential } from "../src/service/googleAuth.service.js";
import { googleLogin, linkGoogle } from "../src/controllers/auth.controller.js";
import { Session } from "../src/models/session.model.js";

const OID = (n) => `507f1f77bcf86cd7994390${String(n).padStart(2, "0")}`;
let originals = [];
const stub = (obj, key, val) => {
  const desc = Object.getOwnPropertyDescriptor(obj, key);
  originals.push([obj, key, desc]);
  try { obj[key] = val; }
  catch { try { Object.defineProperty(obj, key, { configurable: true, writable: true, value: val }); } catch {} }
};
const env = (k, v) => {
  const had = Object.prototype.hasOwnProperty.call(process.env, k);
  originals.push([process.env, k, { had, val: process.env[k], env: true }]);
  if (v === undefined) delete process.env[k]; else process.env[k] = v;
};
const restoreAll = () => {
  for (let i = originals.length - 1; i >= 0; i--) {
    const [obj, key, desc] = originals[i];
    if (desc?.env) {
      if (desc.val === undefined && !desc.had) delete obj[key]; else obj[key] = desc.val;
      continue;
    }
    if (desc) { try { Object.defineProperty(obj, key, desc); } catch { try { obj[key] = desc.value; } catch {} } }
    else { try { delete obj[key]; } catch {} }
  }
  originals = [];
};
afterEach(restoreAll);

const makeRes = () => {
  const res = {
    statusCode: 200, headers: {}, cookies: [], body: null,
    status(code) { this.statusCode = code; return this; },
    json(payload) { this.body = payload; return this; },
    set(k, v) { this.headers[k.toLowerCase()] = v; return this; },
    cookie(...args) { this.cookies.push(args); return this; },
    clearCookie(...args) { this.cookies.push(["clear", ...args]); return this; },
  };
  return res;
};
const callHandler = async (handler, req, res = makeRes()) => {
  let nextErr = null, settled = false;
  await new Promise((resolve) => {
    const done = (e) => { if (!settled) { settled = true; nextErr = e || null; resolve(); } };
    res.json = function (p) { this.body = p; done(); return this; };
    res.status = function (c) { this.statusCode = c; return this; };
    try { Promise.resolve(handler(req, res, done)).catch(done); } catch (e) { done(e); }
    setImmediate(done);
  });
  return { res, nextErr };
};

const validPayload = (over = {}) => ({
  iss: "https://accounts.google.com",
  aud: "test-google-client",
  email: "guser@example.com",
  email_verified: true,
  sub: "google-sub-123",
  name: "Google User",
  picture: "https://img.example/a.png",
  exp: Math.floor(Date.now() / 1000) + 3600,
  ...over,
});
const mockGoogle = (payloadOrError) => {
  stub(OAuth2Client.prototype, "verifyIdToken", async () => {
    if (payloadOrError instanceof Error) throw payloadOrError;
    return { getPayload: () => payloadOrError };
  });
};
const stubGoogleLoginInfra = (currentUser) => {
  // Bypass token/DB in auth+security infra by stubbing low-level deps the controller/services use.
  env("ACCESS_TOKEN_SECRET", "test-access-secret-1234567890");
  env("REFRESH_TOKEN_SECRET", "test-refresh-secret-1234567890");
  env("ACCESS_TOKEN_EXPIRES_IN", "15m");
  env("REFRESH_TOKEN_EXPIRES_IN", "7d");
  stub(Session, "create", async (doc) => ({ _id: doc._id || OID(90), ...doc, revokedAt: null }));
  stub(Session, "find", () => ({ select: () => ({ lean: async () => [] }) }));
  stub(Role, "findOne", () => ({ select: () => ({ lean: async () => ({ permissions: [] }) }) }));
  stub(Setting, "findOne", () => ({ select: () => ({ lean: async () => ({ key: "security.login_alerts_enabled", value: false, valueType: "boolean", isActive: true }) }) }));
  stub(EmailService, "sendNewLoginAlert", async () => true);
  stub(EmailService, "sendSuspiciousLoginAlert", async () => true);
  // User.findById: issueSessionTokens awaits it directly; controller's publicUser() calls .select()
  stub(User, "findById", () => {
    const doc = {
      _id: currentUser._id, email: currentUser.email, name: currentUser.name || "Google User", role: currentUser.role || "user",
      toObject() { return { _id: this._id, email: this.email, name: this.name, role: this.role }; },
    };
    return Object.assign(Promise.resolve(currentUser), { select: async () => doc });
  });
};

test("verifyGoogleCredential: successful verification (mocked external service)", async () => {
  env("GOOGLE_CLIENT_ID", "test-google-client");
  mockGoogle(validPayload());
  const g = await verifyGoogleCredential("valid-id-token");
  assert.equal(g.provider, "google");
  assert.equal(g.providerId, "google-sub-123");
  assert.equal(g.email, "guser@example.com");
});

test("verifyGoogleCredential: invalid Google credentials (library rejects)", async () => {
  env("GOOGLE_CLIENT_ID", "test-google-client");
  mockGoogle(new Error("Wrong number of segments"));
  await assert.rejects(() => verifyGoogleCredential("bad-token"), (e) => e instanceof ApiError && e.statusCode === 401);
});

test("verifyGoogleCredential: expired/invalid token mapped safely (callback failure)", async () => {
  env("GOOGLE_CLIENT_ID", "test-google-client");
  mockGoogle(new Error("Token used too late, exp"));
  await assert.rejects(() => verifyGoogleCredential("expired-token"), (e) => e.statusCode === 401 && !/exp|stack|secret/i.test(e.message));
});

test("verifyGoogleCredential: rejects bad issuer/audience and unverified email", async () => {
  env("GOOGLE_CLIENT_ID", "test-google-client");
  mockGoogle(validPayload({ iss: "https://evil.example" }));
  await assert.rejects(() => verifyGoogleCredential("t"), (e) => e.statusCode === 401);
  restoreAll();
  env("GOOGLE_CLIENT_ID", "test-google-client");
  mockGoogle(validPayload({ email_verified: false }));
  await assert.rejects(() => verifyGoogleCredential("t"), (e) => e.statusCode === 403);
});

test("googleLogin: new Google account creation", async () => {
  env("GOOGLE_CLIENT_ID", "test-google-client");
  mockGoogle(validPayload());
  const created = {
    _id: OID(21), email: "guser@example.com", role: "user", isActivated: true, isEmailVerified: false,
    provider: "", providerId: "", avatar: "", name: "Google User",
    save: async function(){ return this; },
    toObject() { return { _id: this._id, email: this.email, role: this.role }; },
  };
  stub(User, "findOne", async () => null);
  stub(User, "create", async (doc) => Object.assign(created, doc));
  stubGoogleLoginInfra(created);
  const { res, nextErr } = await callHandler(googleLogin, { body: { credential: "good" }, get: () => "ua", ip: "1.2.3.4" });
  assert.equal(nextErr, null);
  assert.equal(res.statusCode, 200);
  assert.equal(res.body?.message, "Google login successful");
  assert.equal(created.isEmailVerified, true);
});

test("googleLogin: existing Google account login (no duplicate create)", async () => {
  env("GOOGLE_CLIENT_ID", "test-google-client");
  mockGoogle(validPayload());
  const existing = {
    _id: OID(22), email: "guser@example.com", role: "user", isActivated: true, isEmailVerified: true,
    provider: "google", providerId: "google-sub-123", avatar: "x", name: "Google User",
    save: async function(){ throw new Error("should not save unchanged"); },
    toObject() { return { _id: this._id, email: this.email, role: this.role }; },
  };
  let created = false;
  stub(User, "findOne", async (q) => (q?.email ? existing : null));
  stub(User, "create", async () => { created = true; return null; });
  stubGoogleLoginInfra(existing);
  const { res, nextErr } = await callHandler(googleLogin, { body: { credential: "good" }, get: () => "ua", ip: "1.2.3.4" });
  assert.equal(nextErr, null);
  assert.equal(res.statusCode, 200);
  assert.equal(created, false);
});

test("googleLogin: duplicate account prevention on race (11000)", async () => {
  env("GOOGLE_CLIENT_ID", "test-google-client");
  mockGoogle(validPayload());
  const raced = {
    _id: OID(23), email: "guser@example.com", role: "user", isActivated: true, isEmailVerified: true,
    provider: "google", providerId: "google-sub-123", name: "Google User",
    save: async function(){ return this; }, toObject() { return { _id: this._id, email: this.email, role: this.role }; },
  };
  let findN = 0;
  stub(User, "findOne", async (q) => {
    findN++;
    if (q?.email && findN <= 1) return null;
    if (q?.providerId && findN <= 2) return null;
    if (q?.email) return raced;
    return null;
  });
  stub(User, "create", async () => { const e = new Error("dup"); e.code = 11000; throw e; });
  stubGoogleLoginInfra(raced);
  const { res, nextErr } = await callHandler(googleLogin, { body: { credential: "good" }, get: () => "ua", ip: "1.2.3.4" });
  assert.equal(nextErr, null);
  assert.equal(res.statusCode, 200);
});

test("linkGoogle: successful account linking (authenticated)", async () => {
  env("GOOGLE_CLIENT_ID", "test-google-client");
  mockGoogle(validPayload({ email: "owner@example.com" }));
  const self = {
    _id: OID(31), email: "owner@example.com", isEmailVerified: true, provider: "", providerId: "", avatar: "",
    save: async function(){ return this; },
  };
  stub(User, "findById", () => ({ select: async () => self }));
  stub(User, "findOne", () => ({ select: async () => null }));
  const { res, nextErr } = await callHandler(linkGoogle, { body: { credential: "good" }, user: { _id: self._id } });
  assert.equal(nextErr, null);
  assert.equal(res.statusCode, 200);
  assert.equal(self.provider, "google");
  assert.equal(self.providerId, "google-sub-123");
});

test("linkGoogle: prevents duplicate linking to another user", async () => {
  env("GOOGLE_CLIENT_ID", "test-google-client");
  mockGoogle(validPayload({ email: "owner@example.com" }));
  const self = { _id: OID(32), email: "owner@example.com", save: async () => {} };
  stub(User, "findById", () => ({ select: async () => self }));
  stub(User, "findOne", () => ({ select: async () => ({ _id: OID(99) }) }));
  const { nextErr } = await callHandler(linkGoogle, { body: { credential: "good" }, user: { _id: self._id } });
  assert.equal(nextErr?.statusCode, 409);
});

test("linkGoogle: rejects unauthorized/mismatched identity (no takeover)", async () => {
  env("GOOGLE_CLIENT_ID", "test-google-client");
  mockGoogle(validPayload({ email: "attacker@example.com" }));
  const self = { _id: OID(33), email: "owner@example.com", save: async () => {} };
  stub(User, "findById", () => ({ select: async () => self }));
  stub(User, "findOne", () => ({ select: async () => null }));
  const { nextErr } = await callHandler(linkGoogle, { body: { credential: "good" }, user: { _id: self._id } });
  assert.equal(nextErr?.statusCode, 400);
  assert.match(nextErr?.message || "", /match/i);
});

test("linkGoogle: requires authenticated session", async () => {
  env("GOOGLE_CLIENT_ID", "test-google-client");
  mockGoogle(validPayload());
  const { nextErr } = await callHandler(linkGoogle, { body: { credential: "good" }, user: null });
  assert.equal(nextErr?.statusCode, 401);
});

test("googleLogin: callback/verification failure surfaces as auth error (no leakage)", async () => {
  env("GOOGLE_CLIENT_ID", "test-google-client");
  mockGoogle(new Error("Google callback network failure"));
  const { nextErr } = await callHandler(googleLogin, { body: { credential: "bad" }, get: () => "ua", ip: "1.2.3.4" });
  assert.equal(nextErr?.statusCode, 401);
  assert.ok(!/network|callback|stack/i.test(nextErr?.message || ""));
});
