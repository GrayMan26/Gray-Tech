'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Container from './Container'
import ThemeToggle from './ThemeToggle'
import { ChevronDown } from 'lucide-react'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const pathname = usePathname()
  const dropdownRef = useRef<HTMLDivElement>(null)
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Detect mobile device
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window)
    }
    
    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)
    return () => {
      window.removeEventListener('resize', checkIsMobile)
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current)
      }
    }
  }, [])

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Handle escape key to close dropdown
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [])

  // Hover handlers for desktop
  const handleMouseEnter = () => {
    if (!isMobile) {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current)
      }
      setIsDropdownOpen(true)
    }
  }

  const handleMouseLeave = () => {
    if (!isMobile) {
      hoverTimeoutRef.current = setTimeout(() => {
        setIsDropdownOpen(false)
      }, 150) // Small delay to prevent flickering
    }
  }

  // Click handler for mobile
  const handleClick = () => {
    if (isMobile) {
      setIsDropdownOpen(!isDropdownOpen)
    }
  }

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/services' },
    { name: 'Certifications', href: '/certifications' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ]

  return (
    <header className={`sticky top-0 z-50 bg-card-bg border-b border-border transition-all duration-300 ${isScrolled ? 'shadow-sm' : ''}`}>
      <Container>
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* GrayTech Dropdown Menu */}
            <div 
              className="relative" 
              ref={dropdownRef}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={handleClick}
                className="flex items-center gap-1 text-xl font-semibold text-foreground hover:text-accent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 rounded px-2 py-1"
                aria-expanded={isDropdownOpen}
                aria-haspopup="true"
              >
                GrayTech
                <ChevronDown 
                  className={`h-4 w-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} 
                />
              </button>

              {/* Dropdown Menu with Fade Animation */}
              <div 
                className={`absolute top-full left-0 mt-2 w-48 bg-card-bg border border-border rounded-lg shadow-lg z-50 py-2 transition-all duration-300 transform origin-top ${
                  isDropdownOpen 
                    ? 'opacity-100 scale-y-100 translate-y-0' 
                    : 'opacity-0 scale-y-95 -translate-y-2 pointer-events-none'
                }`}
              >
                {navItems.map((item, index) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsDropdownOpen(false)}
                    className={`block px-4 py-2 text-sm font-medium transition-all duration-200 hover:bg-gray-light hover:text-accent focus:outline-none focus:bg-gray-light focus:text-accent ${
                      pathname === item.href ? 'text-accent bg-gray-light' : 'text-foreground'
                    }`}
                    style={{
                      transitionDelay: isDropdownOpen ? `${index * 50}ms` : '0ms'
                    }}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
            <ThemeToggle />
          </div>
          
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
