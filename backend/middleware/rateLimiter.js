import rateLimit from 'express-rate-limit';

/**
 * In a serverless invocation there is no real socket, so `req.ip` can be undefined and
 * express-rate-limit raises ERR_ERL_UNDEFINED_IP_ADDRESS — every caller then collapses
 * onto one bucket. Netlify passes the true client address in x-nf-client-connection-ip,
 * so prefer that, then the proxy chain, then the socket.
 */
function clientKey(req) {
  const forwarded = req.headers['x-forwarded-for'];
  const raw =
    req.headers['x-nf-client-connection-ip'] ||
    (typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : undefined) ||
    req.ip ||
    req.socket?.remoteAddress;

  if (!raw) return 'unknown';

  // A single IPv6 allocation hands out far more than one address, so bucket by the /64
  // prefix rather than letting one client rotate past the limit for free.
  if (raw.includes(':')) return raw.split(':').slice(0, 4).join(':');
  return raw;
}

const base = {
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: clientKey,
  // We supply our own IPv6-aware key above; without this the library warns that a custom
  // keyGenerator may not be handling IPv6 correctly.
  validate: { keyGeneratorIpFallback: false },
};

export const apiLimiter = rateLimit({
  ...base,
  windowMs: 15 * 60 * 1000,
  limit: 300,
  message: { success: false, message: 'Too many requests, please try again later' },
});

export const authLimiter = rateLimit({
  ...base,
  windowMs: 15 * 60 * 1000,
  limit: 10,
  message: { success: false, message: 'Too many login attempts, please try again later' },
});

export const contactLimiter = rateLimit({
  ...base,
  windowMs: 60 * 60 * 1000,
  limit: 10,
  message: { success: false, message: 'Too many messages sent, please try again later' },
});
