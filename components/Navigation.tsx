'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'

export function Navigation() {
  const pathname = usePathname()

  const links = [
    { href: '/', label: 'About Me' },
    { href: '/research', label: 'Research' },
    { href: '/conferences', label: 'Conferences' },
    { href: '/teaching', label: 'Teaching' },
  ]

  return (
    <nav className="flex gap-2 w-full">
      {links.map((link) => (
        <Button
          key={link.href}
          asChild
          variant={pathname === link.href ? 'default' : 'outline'}
          className="flex-1"
        >
          <Link href={link.href}>{link.label}</Link>
        </Button>
      ))}
    </nav>
  )
}
