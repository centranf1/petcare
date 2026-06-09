import { z } from 'zod'

export const hewanSchema = z.object({
  nama: z.string().min(1, 'Nama wajib diisi'),
  jenis: z.enum(['KUCING','ANJING','BURUNG','KELINCI','LAINNYA']),
  ras: z.string().optional(),
  tanggalLahir: z.string().optional(),
  beratBadan: z.preprocess((v) => (v ? Number(v) : undefined), z.number().optional()),
  foto: z.string().optional(),
  catatanKhusus: z.string().optional(),
  pelangganId: z.string().optional(),
})

export const appointmentSchema = z.object({
  pelangganId: z.string().optional(),
  hewanId: z.string().min(1, 'Pilih hewan'),
  dokterId: z.string().min(1, 'Pilih dokter'),
  tanggal: z.string().min(1, 'Tanggal wajib'),
  waktu: z.string().min(1, 'Waktu wajib'),
  jenis: z.enum(['PEMERIKSAAN','VAKSINASI','BEDAH','GROOMING','DENTAL','RAWAT_INAP','TELEMEDICINE','HOME_VISIT']),
  keluhan: z.string().optional(),
})

export type HewanInput = z.infer<typeof hewanSchema>
export type AppointmentInput = z.infer<typeof appointmentSchema>
