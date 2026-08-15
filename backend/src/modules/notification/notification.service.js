const nodemailer = require('nodemailer');
const { smtp, clientUrl } = require('../../config/env');
const logger = require('../../shared/utils/logger');

let transporter = null;

function getTransporter() {
  if (!smtp.host || !smtp.user) {
    return null; 
  }
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: smtp.host,
      port: smtp.port,
      secure: false, 
      auth: { user: smtp.user, pass: smtp.pass },
    });
  }
  return transporter;
}

async function sendMail({ to, subject, html }) {
  const t = getTransporter();
  if (!t) {
    logger.warn('SMTP not configured — skipping email send', { to, subject });
    return;
  }

  try {
    const info = await t.sendMail({ from: smtp.from, to, subject, html });
    const previewUrl = nodemailer.getTestMessageUrl(info); // only works for Ethereal accounts
    if (previewUrl) {
      logger.info(`Email sent (Ethereal preview): ${previewUrl}`);
    } else {
      logger.info(`Email sent to ${to}`);
    }
  } catch (err) {
    logger.error('Failed to send email', { error: err.message, to, subject });
  }
}

function formatDate(dateObj) {
  return dateObj.toISOString().slice(0, 10);
}

async function sendAppointmentBooked({ patientEmail, patientName, doctorName, date, startTime }) {
  await sendMail({
    to: patientEmail,
    subject: 'Appointment Confirmed',
    html: `
      <h2>Appointment Confirmed</h2>
      <p>Hi ${patientName},</p>
      <p>Your appointment with <strong>Dr. ${doctorName}</strong> is confirmed for
      <strong>${formatDate(date)} at ${startTime}</strong>.</p>
      <p>If you need to cancel, please do so at least 24 hours in advance.</p>
      <p>— MTHMP</p>
    `,
  });
}

async function sendAppointmentCancelled({ patientEmail, patientName, doctorName, date, startTime, reason, overridden }) {
  await sendMail({
    to: patientEmail,
    subject: 'Appointment Cancelled',
    html: `
      <h2>Appointment Cancelled</h2>
      <p>Hi ${patientName},</p>
      <p>Your appointment with <strong>Dr. ${doctorName}</strong> on
      <strong>${formatDate(date)} at ${startTime}</strong> has been cancelled.</p>
      ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
      ${overridden ? `<p>This cancellation was processed by hospital staff outside the standard notice window.</p>` : ''}
      <p>— MTHMP</p>
    `,
  });
}

async function sendPasswordReset({ to, firstName, resetUrl }) {
  await sendMail({
    to,
    subject: 'Reset your MTHMP password',
    html: `
      <h2>Reset your password</h2>
      <p>Hi ${firstName},</p>
      <p>We received a request to reset your MTHMP password. This link is valid for 1 hour:</p>
      <p><a href="${resetUrl}">${resetUrl}</a></p>
      <p>If you didn't request this, you can safely ignore this email — your password will not change.</p>
      <p>— MTHMP</p>
    `,
  });
}

module.exports = { sendMail, sendAppointmentBooked, sendAppointmentCancelled, sendPasswordReset };