import './globals.css'
import { Inter } from 'next/font/google'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Pomodoro Timer',
  description: 'A simple and effective Pomodoro timer app to boost your productivity',
  keywords: 'pomodoro, timer, productivity, focus, time management',
  author: 'René DeAnda',
  openGraph: {
    title: 'Pomodoro Timer',
    description: 'Boost your productivity with our Pomodoro Timer app',
    url: 'https://pomodoro.makr.io',
    siteName: 'Pomodoro Timer',
    images: [
      {
        url: 'https://pomodoro.makr.io/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pomodoro Timer',
    description: 'Boost your productivity with our Pomodoro Timer app',
    images: ['https://pomodoro.makr.io/og-image.png'],
  },
  icons: {
    icon: '/favicon.svg',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        {/* Google Analytics */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
              `}
            </Script>
          </>
        )}
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}