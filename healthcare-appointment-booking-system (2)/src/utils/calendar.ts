import { Appointment } from '../types/healthcare';

/**
 * Generates an RFC 5545 standard .ics file content for Outlook, Apple Calendar, and Google Calendar
 */
export function generateIcsContent(appointment: Appointment): string {
  // Convert date and time to UTC ISO format: e.g. 2026-10-14 and 09:15 AM
  const dateParts = appointment.date.split('-');
  const timeClean = appointment.time.replace(/[^0-9:]/g, '');
  const [hourStr, minStr] = timeClean.split(':');
  let hour = parseInt(hourStr, 10);
  const isPM = appointment.time.toUpperCase().includes('PM');
  const isAM = appointment.time.toUpperCase().includes('AM');

  if (isPM && hour < 12) hour += 12;
  if (isAM && hour === 12) hour = 0;

  const year = parseInt(dateParts[0], 10);
  const month = parseInt(dateParts[1], 10);
  const day = parseInt(dateParts[2], 10);

  const startD = new Date(Date.UTC(year, month - 1, day, hour, parseInt(minStr, 10), 0));
  const endD = new Date(startD.getTime() + appointment.durationMinutes * 60000);

  const formatIcsDate = (d: Date) => {
    return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const startStr = formatIcsDate(startD);
  const endStr = formatIcsDate(endD);
  const nowStr = formatIcsDate(new Date());

  const summary = `Healthcare Appointment: ${appointment.providerName} (${appointment.providerSpecialty})`;
  const description = `Appointment with ${appointment.providerName} (${appointment.providerTitle}).\\n` +
    `Type: ${appointment.type === 'video_consult' ? 'Telehealth Video Consultation' : 'In-Person Clinic Visit'}\\n` +
    `Clinic: ${appointment.clinicName}\\n` +
    `Location: ${appointment.clinicAddress}\\n` +
    `Reason: ${appointment.reasonForVisit}\\n` +
    `HIPAA Protected Appointment ID: ${appointment.id}\\n` +
    (appointment.type === 'video_consult' ? `Telehealth Room SID: ${appointment.videoRoomSid || 'SECURE_TWILIO_ROOM'}\\n` : '');

  const location = appointment.type === 'video_consult' ? 'Secure Telehealth Video Room' : appointment.clinicAddress;

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Healthcare Network//Appointment Booking System//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `UID:apt-${appointment.id}@healthnetwork.org`,
    `DTSTAMP:${nowStr}`,
    `DTSTART:${startStr}`,
    `DTEND:${endStr}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${location}`,
    'STATUS:CONFIRMED',
    'BEGIN:VALARM',
    'TRIGGER:-PT24H',
    'ACTION:DISPLAY',
    'DESCRIPTION:Reminder: Healthcare appointment tomorrow',
    'END:VALARM',
    'BEGIN:VALARM',
    'TRIGGER:-PT2H',
    'ACTION:DISPLAY',
    'DESCRIPTION:Reminder: Healthcare appointment in 2 hours',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

/**
 * Triggers a download of the .ics file for Outlook or Apple Calendar
 */
export function downloadIcsFile(appointment: Appointment) {
  const icsData = generateIcsContent(appointment);
  const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute('download', `appointment-${appointment.id}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Creates a direct Google Calendar web event URL
 */
export function getGoogleCalendarUrl(appointment: Appointment): string {
  const dateParts = appointment.date.split('-');
  const timeClean = appointment.time.replace(/[^0-9:]/g, '');
  const [hourStr, minStr] = timeClean.split(':');
  let hour = parseInt(hourStr, 10);
  const isPM = appointment.time.toUpperCase().includes('PM');
  const isAM = appointment.time.toUpperCase().includes('AM');

  if (isPM && hour < 12) hour += 12;
  if (isAM && hour === 12) hour = 0;

  const year = parseInt(dateParts[0], 10);
  const month = parseInt(dateParts[1], 10);
  const day = parseInt(dateParts[2], 10);

  const startD = new Date(Date.UTC(year, month - 1, day, hour, parseInt(minStr, 10), 0));
  const endD = new Date(startD.getTime() + appointment.durationMinutes * 60000);

  const formatIcsDate = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const dates = `${formatIcsDate(startD)}/${formatIcsDate(endD)}`;

  const title = encodeURIComponent(`Healthcare Visit: ${appointment.providerName} (${appointment.providerSpecialty})`);
  const details = encodeURIComponent(
    `Consultation with ${appointment.providerName}\nClinic: ${appointment.clinicName}\nReason: ${appointment.reasonForVisit}\nAppointment ID: ${appointment.id}`
  );
  const location = encodeURIComponent(
    appointment.type === 'video_consult' ? 'Secure Telehealth Video Link' : appointment.clinicAddress
  );

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
}
