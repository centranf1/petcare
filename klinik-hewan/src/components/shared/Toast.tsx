"use client"
import React from 'react'

export function toast(message: string) {
  const el = document.createElement('div')
  el.textContent = message
  el.className = 'fixed bottom-6 right-6 bg-teal-600 text-white px-4 py-2 rounded shadow'
  document.body.appendChild(el)
  setTimeout(() => el.remove(), 3000)
}

export default function ToastContainer() {
  return null
}
