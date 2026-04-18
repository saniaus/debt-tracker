const axios = require('axios')

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID
const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`

export async function sendTelegramNotification(message) {
  try {
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      console.warn('Telegram credentials not configured')
      return
    }

    await axios.post(TELEGRAM_API, {
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
      parse_mode: 'HTML'
    })
  } catch (error) {
    console.error('Telegram notification error:', error.message)
  }
}

export function formatDebtNotification(debt) {
  return `
<b>📋 Hutang Baru Ditambahkan</b>

<b>Nama:</b> ${debt.name}
<b>Cicilan/Bulan:</b> Rp ${debt.monthly_payment.toLocaleString('id-ID')}
<b>Tenor:</b> ${debt.tenor} bulan
<b>Total Hutang:</b> Rp ${(debt.monthly_payment * debt.tenor).toLocaleString('id-ID')}
<b>Jatuh Tempo:</b> ${new Date(debt.due_date).toLocaleDateString('id-ID')}
<b>Sisa Hutang:</b> Rp ${debt.remaining_amount.toLocaleString('id-ID')}
  `.trim()
}

export function formatPaymentNotification(debt, amount) {
  return `
<b>✅ Pembayaran Tercatat</b>

<b>Hutang:</b> ${debt.name}
<b>Jumlah Bayar:</b> Rp ${amount.toLocaleString('id-ID')}
<b>Sisa Hutang:</b> Rp ${debt.remaining_amount.toLocaleString('id-ID')}
<b>Jatuh Tempo:</b> ${new Date(debt.due_date).toLocaleDateString('id-ID')}
  `.trim()
}
