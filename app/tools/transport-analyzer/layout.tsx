import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Transport Analyzer | GrayTech Help',
  description: 'Track trip profitability, calculate routes, and analyze transportation costs.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}