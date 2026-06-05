import Link from 'next/link'
import Container from '../../components/Container'
import { BarChart3, Music } from 'lucide-react'

const tools = [
  {
    href: '/tools/transport-analyzer',
    icon: BarChart3,
    title: 'Transport Analyzer',
    description:
      'Track trip profitability, import reservation reports, calculate routes, and analyze costs across your fleet.',
    tags: ['Route Calculation', 'Cost Analysis', 'Fleet Tracking'],
  },
  {
    href: '/tools/metadata-finder',
    icon: Music,
    title: 'Metadata Finder',
    description:
      'Upload an MP3 file to identify the song via Shazam, search Discogs for album art, and write ID3 tags directly into the file.',
    tags: ['Shazam ID', 'Discogs Search', 'ID3 Tags'],
  },
]

export default function ToolsPage() {
  return (
    <main className="min-h-screen py-16">
      <Container>
        <h1 className="text-3xl font-bold text-foreground mb-2">Tools</h1>
        <p className="text-muted mb-10">
          Productivity tools built for GrayTech clients and internal use.
        </p>
        <div className="grid gap-6 md:grid-cols-2">
          {tools.map((t) => {
            const Icon = t.icon
            return (
              <Link
                key={t.href}
                href={t.href}
                className="block bg-card-bg border border-border rounded-xl p-6 hover:border-accent transition-colors group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <Icon className="h-6 w-6 text-accent" />
                  </div>
                  <h2 className="text-lg font-semibold text-foreground group-hover:text-accent transition-colors">
                    {t.title}
                  </h2>
                </div>
                <p className="text-muted text-sm mb-4">{t.description}</p>
                <div className="flex flex-wrap gap-2">
                  {t.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-gray-light text-muted px-2 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            )
          })}
        </div>
      </Container>
    </main>
  )
}