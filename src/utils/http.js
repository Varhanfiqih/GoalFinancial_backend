const { URL } = require('node:url');

function sendJson(res, statusCode, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
  });
  res.end(body);
}

function sendHtml(res, statusCode, html) {
  res.writeHead(statusCode, {
    'Content-Type': 'text/html; charset=utf-8',
    'Content-Length': Buffer.byteLength(html),
  });
  res.end(html);
}

function redirect(res, location) {
  res.writeHead(302, { Location: location });
  res.end();
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) {
        req.destroy();
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      if (!body.trim()) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new Error('Invalid JSON body'));
      }
    });
    req.on('error', reject);
  });
}

function parseRequestUrl(req) {
  const url = new URL(req.url, 'http://localhost');
  return {
    pathname: url.pathname,
    query: Object.fromEntries(url.searchParams.entries()),
  };
}

function getBearerToken(req) {
  const value = req.headers.authorization || '';
  if (!value.startsWith('Bearer ')) return null;
  return value.slice('Bearer '.length).trim();
}

function getCookie(req, name) {
  const cookies = req.headers.cookie || '';
  const match = cookies
    .split(';')
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${name}=`));
  if (!match) return null;
  return decodeURIComponent(match.slice(name.length + 1));
}

module.exports = {
  sendJson,
  sendHtml,
  redirect,
  readJson,
  parseRequestUrl,
  getBearerToken,
  getCookie,
};
