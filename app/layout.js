import './globals.css'

export const metadata = {
  title: 'Debt Tracker - Kelola Hutang Online',
  description: 'Aplikasi untuk mengelola hutang, cicilan, dan pembayaran dengan notifikasi Telegram'
}

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="bg-gray-100">{children}</body>
    </html>
  )
}
