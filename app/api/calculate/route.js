import { supabaseAdmin } from '@/lib/supabase'
import { AppError } from '@/lib/utils'

export async function GET(request) {
  try {
    const { data, error } = await supabaseAdmin
      .from('debts')
      .select('remaining_amount')

    if (error) throw new AppError(error.message, 400)

    const totalRemaining = data.reduce((sum, debt) => sum + debt.remaining_amount, 0)
    const totalDebt = data.length

    return Response.json({
      total_debts: totalDebt,
      total_remaining: totalRemaining,
      debts: data
    })
  } catch (error) {
    return Response.json(
      { error: error.message },
      { status: error.statusCode || 500 }
    )
  }
}
