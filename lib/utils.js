export function calculateRemainingDebt(payments, totalAmount) {
  const totalPaid = payments.reduce((sum, p) => sum + parseFloat(p.amount), 0)
  return Math.max(0, totalAmount - totalPaid)
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount)
}

export function isOverdue(dueDate) {
  return new Date(dueDate) < new Date()
}

export function daysUntilDue(dueDate) {
  const today = new Date()
  const due = new Date(dueDate)
  const diff = due - today
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message)
    this.statusCode = statusCode
  }
}
