'use client'

import { useEffect, useState } from 'react'
import DebtForm from '@/components/DebtForm'
import DebtList from '@/components/DebtList'
import DebtCalculator from '@/components/DebtCalculator'

export default function Home() {
  const [debts, setDebts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchDebts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/debts')
      if (!response.ok) throw new Error('Gagal mengambil data')
      const data = await response.json()
      setDebts(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDebts()
  }, [])

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Debt Tracker</h1>
          <p className="text-gray-600">Kelola hutang dan cicilan Anda dengan mudah</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {!loading && <DebtCalculator debts={debts} />}

        <div className="mt-8">
          <DebtForm onAdd={(newDebt) => {
            setDebts([...debts, newDebt])
          }} />
        </div>

        <div className="mt-8">
          {loading ? (
            <div className="text-center py-8 text-gray-500">Memuat data...</div>
          ) : (
            <DebtList debts={debts} onRefresh={fetchDebts} />
          )}
        </div>
      </div>
    </main>
  )
}
