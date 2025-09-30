import { ReactNode } from 'react'
import Link from 'next/link'

interface ButtonProps {
  children: ReactNode
  href?: string
  onClick?: () => void
  variant?: 'primary' | 'secondary'
  type?: 'button' | 'submit'
  className?: string
}

export default function Button({ 
  children, 
  href, 
  onClick, 
  variant = 'secondary',
  type = 'button',
  className = '' 
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center rounded-lg px-4 py-2 font-medium transition active:scale-[.99] focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2'
  
  const variantClasses = {
    primary: 'bg-accent text-white hover:bg-accent/90',
    secondary: 'border border-gray-200 bg-white text-foreground hover:bg-gray-50'
  }

  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`.trim()

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    )
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      {children}
    </button>
  )
}
