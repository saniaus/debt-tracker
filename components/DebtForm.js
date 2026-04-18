'use client'

import { useState } from 'react'
import { formatCurrency } from '@/lib/utils'

export default function DebtForm({ onAdd }) {
  const [formData, setFormData] = useState({
    name: '',
    monthly_payment: '',
    tenor: '',
    due_date: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const total = formData.monthly_payment && formData.tenor 
    ? parseInt(formData.monthly_payment) * parseInt(formData.tenor)
    : 0

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/debts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          monthly_payment: parseFloat(formData.monthly_payment),
          tenor: parseInt(formData.tenor)
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error)
      }

      const newDebt = await response.json()
      onAdd(newDebt)

      setFormData({
        name: '',
        monthly_payment: '',
        tenor: '',
        due_date: ''
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Tambah Hutang Baru</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nama Hutang</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Contoh: Cicilan Motor, KPR, dll"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Cicilan/Bulan (Rp)</label>
            <input
              type="number"
              name="monthly_payment"
              value={formData.monthly_payment}
              onChange={handleChange}
              placeholder="0"
              required
              min="0"
              step="1000"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Tenor (Bulan)</label>
            <input
              type="number"
              name="tenor"
              value={formData.tenor}
              onChange={handleChange}
              placeholder="0"
              required
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Jatuh Tempo</label>
          <input
            type="date"
            name="due_date"
            value={formData.due_date}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {total > 0 && (
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600">Total Hutang:</p>
            <p className="text-2xl font-bold text-blue-600">{formatCurrency(total)}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {loading ? 'Menyimpan...' : 'Tambah Hutang'}
        </button>
      </form>
    </div>
  )
}
