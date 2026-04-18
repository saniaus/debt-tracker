import { supabaseAdmin } from '@/lib/supabase'
import { sendTelegramNotification, formatDebtNotification } from '@/lib/telegram'
import { AppError } from '@/lib/utils'

export async function GET(request) {
  try {
    const { data, error } = await supabaseAdmin
      .from('debts')
      .select(`
        *,
        payments (amount)
      `)
      .order('due_date', { ascending: true })

    if (error) throw new AppError(error.message, 400)

    const debtsWithRemaining = data.map(debt => ({
      ...debt,
      remaining_amount: debt.remaining_amount || (debt.monthly_payment * debt.tenor)
    }))

    return Response.json(debtsWithRemaining)
  } catch (error) {
    return Response.json(
      { error: error.message },
      { status: error.statusCode || 500 }
    )
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { name, monthly_payment, tenor, due_date } = body

    if (!name || !monthly_payment || !tenor || !due_date) {
      throw new AppError('Missing required fields', 400)
    }

    if (monthly_payment <= 0 || tenor <= 0) {
      throw new AppError('Cicilan dan tenor harus lebih dari 0', 400)
    }

    const totalAmount = monthly_payment * tenor
    const remaining_amount = totalAmount

    const { data, error } = await supabaseAdmin
      .from('debts')
      .insert({
        name,
        monthly_payment: parseFloat(monthly_payment),
        tenor: parseInt(tenor),
        due_date,
        remaining_amount,
        total_amount: totalAmount
      })
      .select()

    if (error) throw new AppError(error.message, 400)

    // Send Telegram notification
    await sendTelegramNotification(formatDebtNotification(data[0]))

    return Response.json(data[0], { status: 201 })
  } catch (error) {
    return Response.json(
      { error: error.message },
      { status: error.statusCode || 500 }
    )
  }
}
