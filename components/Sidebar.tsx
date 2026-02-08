'use client'

import Image from 'next/image'
import { Github, Mail, Award, FileText, Home } from 'lucide-react'

interface SidebarProps {
  isOpen?: boolean
}

export function Sidebar({ isOpen = true }: SidebarProps) {
  return (
    <aside className="w-full md:w-96 bg-primary text-primary-foreground p-8 flex flex-col items-center">
      <div className="text-center">
        {/* Profile Image: try to load from public/yo.jpg (use absolute path) */}
        <div className="mb-6 w-64 h-64 rounded-lg overflow-hidden bg-primary flex items-center justify-center">
          <Image
            src="/yo.jpg"
            alt="Ángel Martínez Muñoz"
            width={256}
            height={256}
            className="w-full h-full object-cover"
          />
        </div>

        <h1 className="text-4xl font-bold leading-tight mb-2">
          Ángel<br />
          Martínez Muñoz
        </h1>

        <p className="text-lg mb-6 opacity-90">
          angel.martinezm(at)urv.cat
        </p>

        {/* Social Links */}
        <div className="flex gap-4 justify-center mb-8 flex-wrap">
          <a
            href="https://www.instagram.com/angelmm__/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 hover:bg-primary-foreground hover:text-primary rounded-lg transition-colors"
            aria-label="Instagram"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12c0-3.403 2.759-6.162 6.162-6.162 3.403 0 6.162 2.759 6.162 6.162 0 3.403-2.759 6.162-6.162 6.162-3.403 0-6.162-2.759-6.162-6.162zm2.889 0c0 1.861 1.512 3.373 3.373 3.373 1.861 0 3.373-1.512 3.373-3.373 0-1.861-1.512-3.373-3.373-3.373-1.861 0-3.373 1.512-3.373 3.373zm11.294-5.793a1.44 1.44 0 11-2.881 0 1.44 1.44 0 012.881 0z" />
            </svg>
          </a>
          <a
            href="https://orcid.org/my-orcid?orcid=0009-0002-8944-5403"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 hover:bg-primary-foreground hover:text-primary rounded-lg transition-colors"
            aria-label="ORCID"
          >
            <Award className="w-6 h-6" />
          </a>
          <a
            href="https://www.researchgate.net/profile/Angel-Martinez-Munoz?ev=hdr_xprf"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 hover:bg-primary-foreground hover:text-primary rounded-lg transition-colors"
            aria-label="ResearchGate"
          >
            <FileText className="w-6 h-6" />
          </a>
          <a
            href="https://scholar.google.com/citations?user=rC-onNMAAAAJ&hl=es"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 hover:bg-primary-foreground hover:text-primary rounded-lg transition-colors"
            aria-label="Google Scholar"
          >
            <Home className="w-6 h-6" />
          </a>
          <a
            href="https://arxiv.org/a/martinezmunoz_a_1.html"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 hover:bg-primary-foreground hover:text-primary rounded-lg transition-colors"
            aria-label="arXiv"
          >
            <Github className="w-6 h-6" />
          </a>
        </div>
      </div>
    </aside>
  )
}
