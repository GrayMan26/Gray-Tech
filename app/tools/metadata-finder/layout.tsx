import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Metadata Finder | GrayTech Help',
  description: 'Identify MP3 files with Shazam, find cover art via Discogs, and write ID3 tags.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}