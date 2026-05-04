import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
  display: 'swap'
});

export const metadata: Metadata = {
  title: 'Dunamis EdTech | #1 AI & Digital Skills Training Institute in Africa',
  description: 'Learn AI, Cybersecurity, Cloud Computing, Data Science & more. Industry-led training with 87% job placement rate. Study abroad programs for Canada, UK, USA & Europe.',
  keywords: 'AI courses Nigeria, Cybersecurity training Lagos, Data Science Abuja, Cloud Computing Africa, Study abroad Nigeria, IELTS preparation, IJMB, JUPEB, tech training Africa',
  generator: 'Dunamis EdTech',
  authors: [{ name: 'Dunamis EdTech' }],
  openGraph: {
    title: 'Dunamis EdTech | Learn AI & Digital Skills, Start Earning in 30 Days',
    description: 'The #1 AI & Digital Skills Training Institute in Africa with Job-Focused Learning and Study Abroad Pathways.',
    type: 'website',
    locale: 'en_NG',
    siteName: 'Dunamis EdTech',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dunamis EdTech | AI & Digital Skills Training',
    description: 'Learn AI & Digital Skills, Start Earning in 30 Days. 87% Job Placement Rate.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.jpg',
    shortcut: '/favicon.jpg',
    apple: '/logo.jpg',
  },
}

export const viewport: Viewport = {
  themeColor: '#0B1F3F',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased min-h-screen">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
