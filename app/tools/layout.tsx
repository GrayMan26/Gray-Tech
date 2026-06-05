import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tools | GrayTech Help',
  description: 'Business productivity tools by GrayTech — Transport Analyzer and Metadata Finder.',
}

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}