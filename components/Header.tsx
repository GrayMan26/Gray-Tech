'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Container from './Container'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/services' },
    { name: 'Certifications', href: '/certifications' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ]

  return (
    <header className={`sticky top-0 z-50 bg-[#1e1e1e] transition-shadow ${isScrolled ? 'shadow-sm' : ''}`}>
      <Container>
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="text-xl font-semibold text-foreground hover:text-accent transition-colors">
            GrayTech Help
          </Link>
          
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-accent hover:underline focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 rounded ${
                  pathname === item.href ? 'text-accent' : 'text-foreground'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Link
              href="/contact"
              className="text-sm font-medium text-accent hover:text-accent/80 transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>
      </Container>
    </header>
  )
}
