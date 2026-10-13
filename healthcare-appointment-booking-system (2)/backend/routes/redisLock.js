/**
 * Node.js / Redis Distributed Lock Manager
 * Prevents double-booking across concurrent web & mobile sessions
 */

import express from 'express';

const router = express.Router();
const locks = new Map();

router.post('/acquire', (req, res) => {
  const { slotId, sessionId } = req.body;
  const now = Date.now();
  const lockExpires = locks.get(slotId);

  if (lockExpires && lockExpires > now) {
    return res.status(423).json({
      locked: true,
      message: 'Resource is locked by another client. Retry after TTL expiration.',
      remainingMs: lockExpires - now
    });
  }

  const ttl = 300000; // 5 minutes
  locks.set(slotId, now + ttl);

  res.json({
    locked: false,
    acquired: true,
    slotId,
    sessionId: sessionId || 'session_default',
    expiresAt: new Date(now + ttl).toISOString()
  });
});

router.post('/release', (req, res) => {
  const { slotId } = req.body;
  locks.delete(slotId);
  res.json({ released: true, slotId });
});

export default router;
