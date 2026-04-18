'use client'

import { useState } from 'react'
import { formatCurrency, isOverdue, daysUntilDue } from '@/lib/utils'

export default function DebtList({ debts, onRefresh }) {
  const [paymentInput, setPaymentInput] = useState({})
  const [loading, setLoading] = useState({})
  const [error, setError] = useState({})

  const handlePayment = async (debtId, amount) => {
    if (!amount || amount <= 0) {
      setError(prev => ({
        ...prev,
        [debtId]: 'Jumlah pembayaran harus lebih dari 0'
      }))
      return
    }

    setLoading(prev => ({ ...prev, [debtId]: true }))
    setError(prev => ({ ...prev, [debtId]: '' }))

    try {
      const response = await fetch(`/api/debts/${debtId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payment_amount: parseFloat(amount) })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error)
      }

      setPaymentInput(prev => ({ ...prev, [debtId]: '' }))
      onRefresh()
    } catch (err) {
      setError(prev => ({ ...prev, [debtId]: err.message }))
    } finally {
      setLoading(prev => ({ ...prev, [debtId]: false }))
    }
  }

  const handleDelete = async (debtId) => {
    if (!confirm('Yakin ingin menghapus hutang ini?')) return

    try {
      const response = await fetch(`/api/debts/${debtId}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Gagal menghapus')
      onRefresh()
    } catch (err) {
      alert('Error: ' + err.message)
    }
  }

  if (debts.length === 0) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <p className="text-gray-500 text-lg">Belum ada hutang. Tambahkan hutang baru untuk memulai.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {debts.map(debt => {
        const daysLeft = daysUntilDue(debt.due_date)
        const overdue = isOverdue(debt.due_date)
        const percentage = ((debt.monthly_payment * debt.tenor - debt.remaining_amount) / (debt.monthly_payment * debt.tenor)) * 100

        return (
          <div key={debt.id} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-800">{debt.name}</h3>
                <p className="text-sm text-gray-500">
                  {debt.tenor} bulan @ {formatCurrency(debt.monthly_payment)}/bulan
                </p>
              </div>
              <button
                onClick={() => handleDelete(debt.id)}
                className="text-red-600 hover:text-red-800 text-sm font-semibold"
              >
                Hapus
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Total Hutang</p>
                <p className="text-lg font-bold text-gray-800">
                  {formatCurrency(debt.monthly_payment * debt.tenor)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Sisa Hutang</p>
                <p className="text-lg font-bold text-red-600">
                  {formatCurrency(debt.remaining_amount)}
                </p>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Progress</span>
                <span className="text-sm font-semibold text-gray-800">{percentage.toFixed(0)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>

            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Jatuh Tempo</p>
              <p className={`font-semibold ${overdue ? 'text-red-600' : 'text-blue-600'}`}>
                {new Date(debt.due_date).toLocaleDateString('id-ID')}
                {!overdue && daysLeft > 0 && (
                  <span className="text-sm text-gray-500 ml-2">({daysLeft} hari lagi)</span>
                )}
                {overdue && <span className="text-sm text-red-500 ml-2">(OVERDUE)</span>}
              </p>
            </div>

            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Jumlah pembayaran"
                value={paymentInput[debt.id] || ''}
                onChange={(e) => setPaymentInput(prev => ({
                  ...prev,
                  [debt.id]: e.target.value
                }))}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                onClick={() => handlePayment(debt.id, paymentInput[debt.id])}
                disabled={loading[debt.id]}
                className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {loading[debt.id] ? 'Proses...' : 'Bayar'}
              </button>
            </div>

            {error[debt.id] && (
              <div className="mt-2 text-sm text-red-600">{error[debt.id]}</div>
            )}
          </div>
        )
      })}
    </div>
  )
}
