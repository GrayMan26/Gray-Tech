import Link from 'next/link'
import { ReactNode } from 'react'

interface ServiceCardProps {
  title: string
  description: string
  icon?: ReactNode
  href?: string
}

export default function ServiceCard({ title, description, icon, href }: ServiceCardProps) {
  const content = (
    <div className="rounded-2xl border border-gray-200 p-6 transition-shadow hover:shadow-sm">
      <div className="flex items-start space-x-3">
        {icon && (
          <div className="flex-shrink-0 text-accent">
            {icon}
          </div>
        )}
        <div>
          <h3 className="font-semibold text-foreground mb-2">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="block focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 rounded-2xl">
        {content}
      </Link>
    )
  }

  return content
}
