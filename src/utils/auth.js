const crypto = require('node:crypto');
const { jwtSecret } = require('../config');

function base64url(input) {
  return Buffer.from(input).toString('base64url');
}

function signToken(payload, expiresInSeconds = 60 * 60 * 24 * 7) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const body = {
    ...payload,
    exp: Math.floor(Date.now() / 1000) + expiresInSeconds,
  };
  const unsigned = `${base64url(JSON.stringify(header))}.${base64url(JSON.stringify(body))}`;
  const signature = crypto.createHmac('sha256', jwtSecret).update(unsigned).digest('base64url');
  return `${unsigned}.${signature}`;
}

function verifyToken(token) {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  const [header, body, signature] = parts;
  const expected = crypto.createHmac('sha256', jwtSecret).update(`${header}.${body}`).digest('base64url');
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;

  const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
  if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;
  return payload;
}

function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.pbkdf2Sync(password, salt, 100_000, 64, 'sha512').toString('hex');
  return { salt, hash };
}

function verifyPassword(password, user) {
  const result = hashPassword(password, user.salt);
  return crypto.timingSafeEqual(Buffer.from(result.hash), Buffer.from(user.passwordHash));
}

function publicUser(user) {
  if (!user) return null;
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    preferences: user.preferences,
    createdAt: user.createdAt,
  };
}

module.exports = {
  signToken,
  verifyToken,
  hashPassword,
  verifyPassword,
  publicUser,
};
