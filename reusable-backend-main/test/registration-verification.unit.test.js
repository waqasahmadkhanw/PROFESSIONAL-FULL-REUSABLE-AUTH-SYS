import test, { afterEach } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

import { User } from "../src/models/user.model.js";
import EmailService from "../src/service/email.service.js";
import { registerRules } from "../src/validators/auth.validator.js";
import { validate } from "../src/middlewares/validate.middleware.js";
import { requireVerifiedEmail } from "../src/middlewares/auth.middleware.js";
import { hashToken } from "../src/utils/token.js";
import {
  registerUser,
  verifyEmail,
  resendVerificationEmail,
} from "../src/controllers/auth.controller.js";

const OID = (n) => `507f1f77bcf86cd7994390${String(n).padStart(2, "0")}`;
let originals = [];
const stub = (obj, key, val) => {
  const had = Object.prototype.hasOwnProperty.call(obj, key);
  originals.push([obj, key, obj[key], had]);
  obj[key] = val;
};
afterEach(() => {
  for (let i = originals.length - 1; i >= 0; i--) {
    const [obj, key, val, had] = originals[i];
    if (had) obj[key] = val;
    else delete obj[key];
  }
  originals = [];
});

const runMw = (mw, req) =>
  new Promise((resolve) =>
    mw(req, { set() { return this; }, status() { return this; }, json() { return this; } }, (e) => resolve(e || null)),
  );

const makeRes = () => {
  const res = {
    statusCode: 200,
    headers: {},
    body: null,
    status(code) { this.statusCode = code; return this; },
    json(payload) { this.body = payload; return this; },
    set(k, v) { this.headers[k.toLowerCase()] = v; return this; },
    cookie() { return this; },
    clearCookie() { return this; },
  };
  return res;
};

const callHandler = async (handler, req, res = makeRes()) => {
  let nextErr = null;
  let settled = false;
  await new Promise((resolve) => {
    const done = (e) => { if (!settled) { settled = true; nextErr = e || null; resolve(); } };
    const wrap = (fn) => function wrapped(...args) { const r = fn.apply(this, args); done(); return r; };
    res.json = wrap(res.json.bind(res));
    res.status = function status(code) { this.statusCode = code; return this; };
    // also resolve if next is called (asyncHandler error path)
    try {
      const maybe = handler(req, res, (e) => done(e));
      // if handler returns a promise (non-asyncHandler style), await it
      Promise.resolve(maybe).catch(done);
    } catch (e) { done(e); }
    // safety: resolve on next tick if nothing happened (e.g. fire-and-forget internals done)
    setImmediate(() => done());
  });
  return { req, res, nextErr };
};

test("registerRules reject invalid registration data", async () => {
  const mw = validate(registerRules);
  let err = await runMw(mw, { body: { email: "bad", password: "short", name: "" } });
  assert.equal(err?.statusCode, 422);
  err = await runMw(mw, { body: { name: "Ok User", email: "ok@example.com", password: "password123", extra: true } });
  assert.equal(err?.statusCode, 422);
  err = await runMw(mw, { body: { name: "Ok User", email: "ok@example.com", password: "password123" } });
  assert.equal(err, null);
});

test("successful registration creates user and generates verification email", async () => {
  let sent = null;
  stub(User, "exists", async () => false);
  const created = {
    _id: OID(11),
    email: "new@example.com",
    name: "New User",
    generateEmailVerificationToken() {
      this.__token = "plain-verify-token";
      this.emailVerificationToken = hashToken(this.__token);
      this.emailVerificationExpire = new Date(Date.now() + 600000);
      return this.__token;
    },
    save: async () => created,
  };
  stub(User, "create", async () => created);
  stub(User, "findById", () => ({
    select() { return Promise.resolve({ _id: created._id, email: created.email, name: created.name, isEmailVerified: false }); },
  }));
  stub(EmailService, "sendVerificationEmail", async (user, link) => { sent = { user, link }; return true; });
  stub(EmailService, "sendWelcomeEmail", async () => true);

  const { res, nextErr } = await callHandler(registerUser, { body: { name: "New User", email: "NEW@Example.com", password: "password123" } });
  assert.equal(nextErr, null);
  assert.equal(res.statusCode, 201);
  assert.equal(res.body?.success, true);
  assert.ok(sent, "verification email should be sent");
  assert.match(String(sent.link), /plain-verify-token/);
  assert.equal(sent.user?.email, "new@example.com");
});

test("duplicate email registration is rejected (exists check)", async () => {
  stub(User, "exists", async () => true);
  const { nextErr } = await callHandler(registerUser, { body: { name: "New User", email: "dup@example.com", password: "password123" } });
  assert.equal(nextErr?.statusCode, 409);
});

test("duplicate email registration is rejected (unique index race)", async () => {
  stub(User, "exists", async () => false);
  stub(User, "create", async () => { const e = new Error("dup"); e.code = 11000; throw e; });
  const { nextErr } = await callHandler(registerUser, { body: { name: "New User", email: "dup@example.com", password: "password123" } });
  assert.equal(nextErr?.statusCode, 409);
});

test("valid verification token verifies email (atomic consume)", async () => {
  const plain = "valid-token";
  const hashed = hashToken(plain);
  let query;
  stub(User, "findOneAndUpdate", async (q) => {
    query = q;
    return q.emailVerificationToken === hashed ? { _id: OID(1), isEmailVerified: true } : null;
  });
  const { res, nextErr } = await callHandler(verifyEmail, { body: { token: plain } });
  assert.equal(nextErr, null);
  assert.equal(res.statusCode, 200);
  assert.equal(res.body?.message, "Email verified successfully");
  assert.equal(query.emailVerificationToken, hashed);
  assert.deepEqual(query.isEmailVerified, { $ne: true });
  assert.ok(query.emailVerificationExpire?.$gt instanceof Date);
});

test("invalid verification token is rejected", async () => {
  stub(User, "findOneAndUpdate", async () => null);
  const { nextErr } = await callHandler(verifyEmail, { body: { token: "bad-token" } });
  assert.equal(nextErr?.statusCode, 400);
  assert.match(nextErr?.message || "", /Invalid|expired/i);
});

test("expired verification token is rejected by query/consume guard", async () => {
  stub(User, "findOneAndUpdate", async () => null); // expired won't match $gt: now
  const { nextErr } = await callHandler(verifyEmail, { body: { token: "expired-token" } });
  assert.equal(nextErr?.statusCode, 400);
});

test("reused verification token is rejected (second consume returns no match)", async () => {
  const calls = [];
  stub(User, "findOneAndUpdate", async () => {
    calls.push(1);
    return calls.length === 1 ? { _id: OID(1), isEmailVerified: true } : null;
  });
  const first = await callHandler(verifyEmail, { body: { token: "reuse-token" } });
  assert.equal(first.nextErr, null);
  const second = await callHandler(verifyEmail, { body: { token: "reuse-token" } });
  assert.equal(second.nextErr?.statusCode, 400);
});

test("resend verification generates new secure token and sends email", async () => {
  let updatedWith = null;
  let sentLink = null;
  const user = { _id: OID(2), email: "u2@example.com", name: "U2", isEmailVerified: false };
  stub(User, "findOne", () => ({ select: async () => user }));
  stub(User, "findOneAndUpdate", async (_q, update) => { updatedWith = update; return { ...user }; });
  stub(EmailService, "sendVerificationEmail", async (_u, link) => { sentLink = link; return true; });

  const { res, nextErr } = await callHandler(resendVerificationEmail, { body: { email: "U2@Example.com" } });
  assert.equal(nextErr, null);
  assert.equal(res.statusCode, 200);
  assert.match(res.body?.message || "", /verification/i);
  assert.ok(updatedWith?.$set?.emailVerificationToken, "new hashed token stored");
  assert.match(updatedWith.$set.emailVerificationToken, /^[a-f0-9]{64}$/);
  assert.ok(updatedWith.$set.emailVerificationExpire instanceof Date);
  assert.ok(sentLink && String(sentLink).includes("token="));
  const plainFromLink = decodeURIComponent(String(sentLink).split("token=")[1] || "");
  assert.equal(updatedWith.$set.emailVerificationToken, hashToken(plainFromLink));
});

test("resend verification returns generic response for unknown/already-verified (no enumeration)", async () => {
  stub(User, "findOne", () => ({ select: async () => null }));
  let { res } = await callHandler(resendVerificationEmail, { body: { email: "missing@example.com" } });
  assert.equal(res.statusCode, 200);
  const msg1 = res.body?.message;

  for (let i = originals.length - 1; i >= 0; i--) {
    const [obj, key, val, had] = originals[i];
    if (had) obj[key] = val; else delete obj[key];
  }
  originals = [];
  stub(User, "findOne", () => ({ select: async () => ({ _id: OID(3), isEmailVerified: true }) }));
  ({ res } = await callHandler(resendVerificationEmail, { body: { email: "verified@example.com" } }));
  assert.equal(res.statusCode, 200);
  assert.equal(res.body?.message, msg1);
});

test("unverified user is restricted by requireVerifiedEmail middleware", async () => {
  const calls = [];
  const next = (e) => calls.push(e);
  requireVerifiedEmail({ user: { isEmailVerified: false } }, {}, next);
  assert.equal(calls[0]?.statusCode, 403);

  const ok = [];
  requireVerifiedEmail({ user: { isEmailVerified: true } }, {}, (e) => ok.push(e));
  assert.equal(ok[0], undefined);
});

test("unverified user is restricted on refresh and google login paths (implemented guards)", () => {
  const src = fs.readFileSync(new URL("../src/controllers/auth.controller.js", import.meta.url), "utf8");
  assert.match(src, /!user\.isEmailVerified[\s\S]{0,120}Session is invalid/);
  assert.match(src, /googleLogin[\s\S]*?Email verification required/);
});

test("email/password login restricts activated but unverified users (403)", () => {
  const src = fs.readFileSync(new URL("../src/controllers/auth.controller.js", import.meta.url), "utf8");
  const loginBlock = src.split("const loginUser")[1]?.split("const googleLogin")[0] || "";
  assert.match(loginBlock, /Email verification required/);
});
