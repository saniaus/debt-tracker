import { supabaseAdmin } from '@/lib/supabase'
import { sendTelegramNotification, formatPaymentNotification } from '@/lib/telegram'
import { AppError } from '@/lib/utils'

export async function PATCH(request, { params }) {
  try {
    const { id } = params
    const body = await request.json()
    const { payment_amount } = body

    if (!payment_amount || payment_amount <= 0) {
      throw new AppError('Jumlah pembayaran harus lebih dari 0', 400)
    }

    // Get current debt
    const { data: debtData, error: debtError } = await supabaseAdmin
      .from('debts')
      .select('*')
      .eq('id', id)
      .single()

    if (debtError) throw new AppError('Hutang tidak ditemukan', 404)

    const newRemaining = Math.max(0, debtData.remaining_amount - payment_amount)

    // Record payment
    await supabaseAdmin
      .from('payments')
      .insert({
        debt_id: id,
        amount: parseFloat(payment_amount)
      })

    // Update debt remaining amount
    const { data, error } = await supabaseAdmin
      .from('debts')
      .update({ remaining_amount: newRemaining })
      .eq('id', id)
      .select()
      .single()

    if (error) throw new AppError(error.message, 400)

    // Send Telegram notification
    await sendTelegramNotification(formatPaymentNotification(data, payment_amount))

    return Response.json(data)
  } catch (error) {
    return Response.json(
      { error: error.message },
      { status: error.statusCode || 500 }
    )
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params

    const { error } = await supabaseAdmin
      .from('debts')
      .delete()
      .eq('id', id)

    if (error) throw new AppError(error.message, 400)

    return Response.json({ message: 'Hutang dihapus' })
  } catch (error) {
    return Response.json(
      { error: error.message },
      { status: error.statusCode || 500 }
    )
  }
}
