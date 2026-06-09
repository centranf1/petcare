import { NextResponse } from 'next/server'
import sendUpcomingAppointmentReminders from '@/lib/reminders'

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const hours = Number(body.hours || 24)
    const result = await sendUpcomingAppointmentReminders(hours)
    return NextResponse.json({ message: 'Reminders sent', ...result })
  } catch (err) {
    return NextResponse.json({ message: 'Error sending reminders' }, { status: 500 })
  }
}
