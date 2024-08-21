
import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Pomodoro Timer',
  description: 'A simple and effective Pomodoro timer app to boost your productivity',
  keywords: 'pomodoro, timer, productivity, focus, time management',
  author: 'René DeAnda',
  openGraph: {
    title: 'Pomodoro Timer',
    description: 'Boost your productivity with our Pomodoro Timer app',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Pomodoro Timer' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pomodoro Timer',
    description: 'Boost your productivity with our Pomodoro Timer app',
    images: ['/og-image.png'],
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
