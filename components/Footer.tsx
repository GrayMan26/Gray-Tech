import Link from 'next/link'
import Container from './Container'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const quickLinks = [
    { name: 'Services', href: '/services' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ]

  return (
    <footer className="border-t border-gray-800 bg-[#1e1e1e]">
      <Container className="py-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex flex-col space-y-2">
            <p className="text-sm text-gray-300">
              © {currentYear} GrayTech Help
            </p>
            <p className="text-sm text-gray-300">
              Philadelphia, PA
            </p>
          </div>
          
          <div className="flex space-x-6">
            {quickLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm text-gray-300 hover:text-accent transition-colors hover:underline"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  )
}
