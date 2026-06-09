import React from 'react'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-teal-50 to-white">
      <section className="container mx-auto p-6">
        <div className="py-12 text-center">
          <h1 className="text-4xl font-bold text-teal-700">Kesehatan Hewan Peliharaan Anda, Prioritas Kami</h1>
          <p className="mt-4 text-gray-600">Selamat datang di Klinik Hewan App.</p>
          <div className="mt-6 space-x-4">
            <a href="/login" className="px-4 py-2 bg-teal-600 text-white rounded">Buat Janji</a>
            <a href="/login" className="px-4 py-2 border border-teal-600 text-teal-600 rounded">Login</a>
          </div>
        </div>
      </section>
    </main>
  )
}
