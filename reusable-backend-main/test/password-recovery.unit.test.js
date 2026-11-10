import test, { afterEach } from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";

import { User } from "../src/models/user.model.js";
import { Session } from "../src/models/session.model.js";
import EmailService from "../src/service/email.service.js";
import { hashToken } from "../src/utils/token.js";
import {
  forgotPassword,
  resetPassword,
  changeCurrentPassword,
} from "../src/controllers/auth.controller.js";

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

test("forgot password with existing email generates secure token and sends reset email (generic response)", async () => {
  env("WEB_URL", "http://localhost:3000");
  let sentLink = null;
  const user = {
    _id: OID(41), email: "u@example.com", name: "U",
    resetPasswordToken: undefined, resetPasswordExpire: undefined,
    generatePasswordResetToken() {
      const plain = "plain-reset-token-0123456789abcdef0123456789abcdef";
      this.__plain = plain;
      this.resetPasswordToken = hashToken(plain);
      this.resetPasswordExpire = new Date(Date.now() + 15 * 60 * 1000);
      return plain;
    },
    save: async function(){ return this; },
  };
  stub(User, "findOne", async (q) => (q?.email === "u@example.com" ? user : null));
  stub(EmailService, "sendResetPasswordEmail", async (_u, link) => { sentLink = link; return true; });

  const { res, nextErr } = await callHandler(forgotPassword, { body: { email: "U@Example.com" } });
  assert.equal(nextErr, null);
  assert.equal(res.statusCode, 200);
  assert.match(res.body?.message || "", /reset link has been sent/i);
  assert.ok(user.resetPasswordToken, "hashed token stored");
  assert.match(user.resetPasswordToken, /^[a-f0-9]{64}$/);
  assert.ok(user.resetPasswordExpire instanceof Date);
  assert.ok(sentLink && String(sentLink).includes("token="));
  const plainFromLink = decodeURIComponent(String(sentLink).split("token=")[1] || "");
  assert.equal(user.resetPasswordToken, hashToken(plainFromLink));
  assert.notEqual(user.resetPasswordToken, plainFromLink);
});

test("forgot password with nonexistent email returns generic response (no enumeration, no send)", async () => {
  let sent = false;
  stub(User, "findOne", async () => null);
  stub(EmailService, "sendResetPasswordEmail", async () => { sent = true; return true; });
  const { res, nextErr } = await callHandler(forgotPassword, { body: { email: "missing@example.com" } });
  assert.equal(nextErr, null);
  assert.equal(res.statusCode, 200);
  assert.match(res.body?.message || "", /reset link has been sent/i);
  assert.equal(sent, false);
});

test("secure token generation produces unpredictable token and stores only hash+expiry", () => {
  const t1 = crypto.randomBytes(32).toString("hex");
  const t2 = crypto.randomBytes(32).toString("hex");
  assert.notEqual(t1, t2);
  assert.equal(t1.length, 64);
  assert.equal(hashToken(t1), crypto.createHash("sha256").update(t1).digest("hex"));
  const doc = { resetPasswordToken: null, resetPasswordExpire: null };
  User.schema.methods.generatePasswordResetToken.call(doc);
  assert.ok(doc.resetPasswordToken && /^[a-f0-9]{64}$/.test(doc.resetPasswordToken));
  assert.ok(doc.resetPasswordExpire > Date.now());
});

test("valid reset token updates password, clears token, revokes sessions", async () => {
  const plain = "valid-reset-token";
  const hashed = hashToken(plain);
  const user = {
    _id: OID(42), password: "old-hash", resetPasswordToken: hashed, resetPasswordExpire: new Date(Date.now() + 600000),
    save: async function(){ this.saved = true; return this; },
  };
  let revokeId = null;
  stub(User, "findOne", () => ({ select: async () => user }));
  stub(Session, "updateMany", async (q) => { revokeId = String(q.user); return { modifiedCount: 1 }; });
  const { res, nextErr } = await callHandler(resetPassword, { params: { token: plain }, body: { password: "NewPassword123!" } });
  assert.equal(nextErr, null);
  assert.equal(res.statusCode, 200);
  assert.equal(res.body?.message, "Password reset successful");
  assert.equal(user.password, "NewPassword123!");
  assert.equal(user.resetPasswordToken, undefined);
  assert.equal(user.resetPasswordExpire, undefined);
  assert.equal(user.saved, true);
  assert.equal(revokeId, String(OID(42)));
});

test("invalid reset token is rejected", async () => {
  stub(User, "findOne", () => ({ select: async () => null }));
  const { nextErr } = await callHandler(resetPassword, { params: { token: "bad" }, body: { password: "NewPassword123!" } });
  assert.equal(nextErr?.statusCode, 400);
  assert.match(nextErr?.message || "", /Invalid|expired/i);
});

test("expired reset token is rejected (no match)", async () => {
  stub(User, "findOne", () => ({ select: async () => null })); // controller queries $gt: now
  const { nextErr } = await callHandler(resetPassword, { params: { token: "expired" }, body: { password: "NewPassword123!" } });
  assert.equal(nextErr?.statusCode, 400);
});

test("reused reset token is rejected (cleared after first use)", async () => {
  const plain = "reuse-reset-token";
  let calls = 0;
  stub(User, "findOne", () => ({
    select: async () => {
      calls++;
      if (calls === 1) return { _id: OID(43), resetPasswordToken: hashToken(plain), resetPasswordExpire: new Date(Date.now() + 600000), save: async function(){ this.resetPasswordToken = undefined; return this; } };
      return null; // token cleared/consumed
    },
  }));
  stub(Session, "updateMany", async () => ({ modifiedCount: 1 }));
  const first = await callHandler(resetPassword, { params: { token: plain }, body: { password: "NewPassword123!" } });
  assert.equal(first.nextErr, null);
  const second = await callHandler(resetPassword, { params: { token: plain }, body: { password: "NewPassword123!" } });
  assert.equal(second.nextErr?.statusCode, 400);
});

test("change password: old password rejection and password mismatch/validation", async () => {
  stub(User, "findById", () => ({ select: async () => ({ _id: OID(44), email: "a@b.com", name: "A", isPasswordCorrect: async () => false }) }));
  let r = await callHandler(changeCurrentPassword, { user: { _id: OID(44) }, body: { oldPassword: "wrong", newPassword: "newpassword" } });
  assert.equal(r.nextErr?.statusCode, 400);
  assert.match(r.nextErr?.message || "", /Current password is incorrect/i);

  restoreAll();
  r = await callHandler(changeCurrentPassword, { user: { _id: OID(44) }, body: { oldPassword: "oldpass", newPassword: "short" } });
  assert.equal(r.nextErr?.statusCode, 400);
});

test("change password: accepts new password, updates, revokes existing sessions", async () => {
  const user = {
    _id: OID(45), email: "a@b.com", name: "A",
    isPasswordCorrect: async (p) => p === "OldPassword123!",
    save: async function(){ this.saved = true; return this; },
  };
  let revokeId = null;
  stub(User, "findById", () => ({ select: async () => user }));
  stub(Session, "updateMany", async (q) => { revokeId = String(q.user); return { modifiedCount: 1 }; });
  stub(EmailService, "sendPasswordChangeEmail", async () => true);

  const { res, nextErr } = await callHandler(changeCurrentPassword, { user: { _id: OID(45) }, body: { oldPassword: "OldPassword123!", newPassword: "NewPassword123!" } });
  assert.equal(nextErr, null);
  assert.equal(res.statusCode, 200);
  assert.equal(user.password, "NewPassword123!");
  assert.equal(user.saved, true);
  assert.equal(revokeId, String(OID(45)));
});
