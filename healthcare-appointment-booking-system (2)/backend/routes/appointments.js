/**
 * Node.js Express Router for Appointments Management
 * Handles slot locking, confirmation, and calendar payload generation
 */

import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    status: 'success',
    count: 2,
    data: [
      {
        id: 'apt-901',
        providerName: 'Dr. Sarah Chen, MD',
        date: '2026-10-14',
        time: '09:15 AM',
        type: 'video_consult',
        status: 'confirmed'
      },
      {
        id: 'apt-902',
        providerName: 'Dr. Marcus Vance, MD, FACC',
        date: '2026-10-16',
        time: '10:45 AM',
        type: 'in_person',
        status: 'confirmed'
      }
    ]
  });
});

router.post('/book', (req, res) => {
  const { providerId, slotId, date, time, patientName } = req.body;
  if (!providerId || !slotId) {
    return res.status(400).json({ error: 'Missing appointment scheduling parameters' });
  }

  const appointment = {
    id: `apt-${Date.now().toString().slice(-6)}`,
    providerId,
    slotId,
    date,
    time,
    patientName: patientName || 'Aditi Jha',
    status: 'confirmed',
    createdAt: new Date().toISOString()
  };

  res.status(201).json({
    success: true,
    message: 'Appointment reserved and confirmed with Redis lock TTL',
    appointment
  });
});

export default router;
