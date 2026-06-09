import React from 'react'
import * as PDF from '@react-pdf/renderer'

const { Page, Text, View, Document, StyleSheet, Image, pdf } = PDF as any

export const generateHewanCardDocument = (hewan: any, owner: any) => {
  const styles = StyleSheet.create({
    page: { padding: 20 },
    header: { fontSize: 18, marginBottom: 10 },
    section: { marginBottom: 8 }
  })

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>Kartu Digital Hewan</Text>
        <View style={styles.section}><Text>Nama: {hewan.nama}</Text></View>
        <View style={styles.section}><Text>Jenis: {hewan.jenis}</Text></View>
        <View style={styles.section}><Text>Ras: {hewan.ras}</Text></View>
        <View style={styles.section}><Text>Tanggal Lahir: {hewan.tanggalLahir ? new Date(hewan.tanggalLahir).toLocaleDateString() : '-'}</Text></View>
        <View style={styles.section}><Text>Berat: {hewan.beratBadan ?? '-'}</Text></View>
        <View style={styles.section}><Text>Pemilik: {owner?.name ?? '-'}</Text></View>
      </Page>
    </Document>
  )
}

export const generateRekamMedisDocument = (rekam: any) => {
  const styles = StyleSheet.create({ page: { padding: 20 }, header: { fontSize: 18, marginBottom: 10 }, section: { marginBottom: 8 } })

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>Rekam Medis</Text>
        <View style={styles.section}><Text>Keluhan: {rekam.keluhan}</Text></View>
        <View style={styles.section}><Text>Diagnosis: {rekam.diagnosis || '-'}</Text></View>
        <View style={styles.section}><Text>Tindakan: {rekam.tindakan || '-'}</Text></View>
        <View style={styles.section}><Text>Resep: {rekam.resep || '-'}</Text></View>
      </Page>
    </Document>
  )
}

export const generateAppointmentsPdfDocument = (appointments: any[]) => {
  const styles = StyleSheet.create({
    page: { padding: 20 },
    header: { fontSize: 18, marginBottom: 10 },
    section: { marginBottom: 8, paddingBottom: 6, borderBottomWidth: 1, borderBottomColor: '#cccccc' },
    item: { fontSize: 12 },
  })

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>Laporan Janji Temu</Text>
        {appointments.map((appt, index) => (
          <View key={appt.id || index} style={styles.section}>
            <Text style={styles.item}>No: {index + 1}</Text>
            <Text style={styles.item}>Tanggal: {appt.tanggal?.toString() || appt.tanggal}</Text>
            <Text style={styles.item}>Waktu: {appt.waktu}</Text>
            <Text style={styles.item}>Jenis: {appt.jenis}</Text>
            <Text style={styles.item}>Hewan: {appt.hewan?.nama || '-'}</Text>
            <Text style={styles.item}>Pemilik: {appt.pelanggan?.name || '-'}</Text>
            <Text style={styles.item}>Dokter: {appt.dokter?.name || '-'}</Text>
          </View>
        ))}
      </Page>
    </Document>
  )
}

export async function createPdfBufferFromDocument(docElement: React.ReactElement) {
  const doc = pdf(docElement)
  const buffer = await doc.toBuffer()
  return buffer
}
