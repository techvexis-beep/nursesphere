import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import './globals.css'
import ClientWrapper from './ClientWrapper'

const geist = Inter({
  subsets: ['latin'],
  variable: '--font-geist',
})

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-poppins',
})

export const metadata: Metadata = {
  title: 'NurseSphere - Global Nursing Platform',
  description: 'AI-powered nursing ecosystem for education, migration tracking, and professional growth',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><defs><linearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'><stop offset='0%25' stop-color='%230070F3'/><stop offset='100%25' stop-color='%230053B8'/></linearGradient></defs><circle cx='50' cy='50' r='46' fill='url(%23g)' opacity='0.2'/><path d='M25 55 Q25 35 50 32 Q75 35 75 55 L75 60 Q75 65 50 68 Q25 65 25 60 Z' fill='url(%23g)'/><rect x='46' y='40' width='8' height='22' rx='2' fill='white'/><rect x='39' y='47' width='22' height='8' rx='2' fill='white'/></svg>" />
      </head>
      <body className={`${geist.variable} ${poppins.variable} font-sans antialiased`}>
        <ClientWrapper>
          {children}
        </ClientWrapper>
      </body>
    </html>
  )
}
