import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function sendWelcomeEmail(to: string, name: string) {
  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to,
    subject: `Selamat datang, ${name}`,
    html: `<p>Halo ${name}, selamat datang di Klinik Hewan.</p>`,
  })
}

export async function sendAppointmentConfirmation(to: string, appointment: any) {
  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to,
    subject: `Konfirmasi Janji Temu - ${appointment.jenis}`,
    html: `<p>Janji temu Anda pada ${appointment.tanggal} telah dikonfirmasi.</p>`,
  })
}

export async function sendAppointmentReminder(to: string, appointment: any) {
  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to,
    subject: `Pengingat Janji Temu - ${appointment.jenis}`,
    html: `<p>Ingat janji temu Anda pada ${appointment.tanggal}.</p>`,
  })
}

export async function sendAppointmentCancellation(to: string, appointment: any) {
  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to,
    subject: `Pembatalan Janji Temu - ${appointment.jenis}`,
    html: `<p>Janji temu Anda pada ${appointment.tanggal} telah dibatalkan.</p>`,
  })
}

export async function sendPasswordReset(to: string, token: string) {
  const url = `${process.env.NEXTAUTH_URL || process.env.NOW_URL || 'http://localhost:3000'}/reset-password?token=${token}`
  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to,
    subject: `Reset Password`,
    html: `<p>Silakan klik <a href="${url}">tautan ini</a> untuk mereset password Anda.</p>`,
  })
}

export default transporter
