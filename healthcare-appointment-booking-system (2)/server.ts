import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// In-memory data store mimicking PostgreSQL tables and Redis cache
const clinics = [
  { id: 'clinic-1', name: 'Metro Health Downtown Pavilion', city: 'San Francisco', phone: '(415) 892-4100' },
  { id: 'clinic-2', name: 'Westside Specialty Care Center', city: 'San Francisco', phone: '(415) 762-3300' },
  { id: 'clinic-3', name: 'North Suburban Family Health', city: 'San Rafael', phone: '(415) 620-8910' },
  { id: 'clinic-4', name: 'East Bay Regional Medical Complex', city: 'Oakland', phone: '(510) 934-2200' },
  { id: 'clinic-5', name: 'South Shore Pediatrics & Wellness', city: 'South San Francisco', phone: '(650) 441-7890' },
  { id: 'clinic-6', name: 'Summit Orthopedic & Spine Institute', city: 'Berkeley', phone: '(510) 840-5120' },
  { id: 'clinic-7', name: 'Valley Dermatology & Skin Center', city: 'Palo Alto', phone: '(650) 329-8800' },
  { id: 'clinic-8', name: 'Highland Neurology & Brain Health', city: 'San Mateo', phone: '(650) 571-3340' },
];

// Redis lock cache simulator (key -> expiration timestamp)
const redisSlotLocks = new Map<string, number>();

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json());

  // API Routes
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      status: 'UP',
      techStack: {
        backend: 'Node.js (Express)',
        database: 'PostgreSQL (Emulated Schema)',
        cache: 'Redis (TTL Lock Manager)',
        video: 'Twilio Video SDK / WebRTC',
        security: 'AES-256-GCM / OAuth2 / JWT',
      },
      providersOnboarded: 120,
      noShowReduction: '35%',
    });
  });

  app.get('/api/clinics', (_req: Request, res: Response) => {
    res.json(clinics);
  });

  // Redis lock slot endpoint
  app.post('/api/slots/lock', (req: Request, res: Response) => {
    const { slotId } = req.body;
    if (!slotId) {
      return res.status(400).json({ error: 'slotId required' });
    }

    const now = Date.now();
    const existingLock = redisSlotLocks.get(slotId);

    if (existingLock && existingLock > now) {
      return res.status(409).json({ error: 'Slot is currently locked by another patient' });
    }

    // Set 5-minute Redis TTL lock
    const expiresAt = now + 5 * 60 * 1000;
    redisSlotLocks.set(slotId, expiresAt);

    return res.json({
      success: true,
      slotId,
      lockedUntil: expiresAt,
      ttlSeconds: 300,
    });
  });

  // Twilio Video token generator endpoint
  app.post('/api/video/token', (req: Request, res: Response) => {
    const { identity, roomName } = req.body;
    const room = roomName || `RM-${Math.floor(10000 + Math.random() * 90000)}-TWILIO-VIDEO`;
    
    // Simulate HMAC-SHA256 JWT Twilio Access Token structure
    const mockJwt = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${Buffer.from(
      JSON.stringify({
        jti: `SK${Math.random().toString(36).substring(7)}`,
        iss: 'AC_TWILIO_HEALTHCARE_SID',
        sub: identity || 'patient_user',
        room,
        grants: { video: { room } },
        exp: Math.floor(Date.now() / 1000) + 3600,
      })
    ).toString('base64')}.simulated_hmac_sha256_signature`;

    res.json({
      token: mockJwt,
      identity: identity || 'patient_user',
      roomName: room,
      webrtcIceServers: [{ urls: 'stun:global.stun.twilio.com:3478?transport=udp' }],
    });
  });

  // Automated reminder test dispatcher
  app.post('/api/reminders/dispatch', (req: Request, res: Response) => {
    const { appointmentId, channel, recipient } = req.body;
    res.json({
      success: true,
      messageId: `msg-${Date.now()}`,
      channel,
      recipient,
      dispatchedAt: new Date().toISOString(),
      status: 'DELIVERED',
      noShowImpact: '35% reduction active',
    });
  });

  // Vite development middleware
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Healthcare Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
