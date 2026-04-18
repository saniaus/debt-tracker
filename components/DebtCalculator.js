'use client'

import { formatCurrency } from '@/lib/utils'

export default function DebtCalculator({ debts }) {
  const totalDebt = debts.reduce((sum, d) => sum + (d.monthly_payment * d.tenor), 0)
  const totalRemaining = debts.reduce((sum, d) => sum + d.remaining_amount, 0)
  const totalPaid = totalDebt - totalRemaining
  const percentage = totalDebt > 0 ? (totalPaid / totalDebt) * 100 : 0

  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Ringkasan Hutang</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div>
          <p className="text-blue-100 text-sm mb-1">Total Hutang</p>
          <p className="text-3xl font-bold">{formatCurrency(totalDebt)}</p>
        </div>

        <div>
          <p className="text-blue-100 text-sm mb-1">Sudah Dibayar</p>
          <p className="text-3xl font-bold text-green-300">{formatCurrency(totalPaid)}</p>
        </div>

        <div>
          <p className="text-blue-100 text-sm mb-1">Sisa Hutang</p>
          <p className="text-3xl font-bold text-red-300">{formatCurrency(totalRemaining)}</p>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-blue-100">Progres Pembayaran</span>
          <span className="text-lg font-bold">{percentage.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-blue-400 rounded-full h-3">
          <div
            className="bg-green-400 h-3 rounded-full transition-all"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>

      <p className="text-blue-100 text-sm mt-4">
        📊 Total {debts.length} hutang yang sedang berjalan
      </p>
    </div>
  )
}
