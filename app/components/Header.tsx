'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="">
          <Link href="/" className="flex items-center gap-2">
            <Image 
              src="/mapwipers_logo-horizontal.png" 
              alt="MapWipers Logo" 
              width={140} 
              height={40}
              className="h-10 w-auto"
            />
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <a
            href="#how-it-works"
            className="text-sm text-[#0D2959]/70 hover:text-[#0D2959]"
          >
            How it Works
          </a>
          <a
            href="#pricing"
            className="text-sm text-[#0D2959]/70 hover:text-[#0D2959]"
          >
            Pricing
          </a>
          <a
            href="#faq"
            className="text-sm text-[#0D2959]/70 hover:text-[#0D2959]"
          >
            FAQ
          </a>
          <Link
            href="/contact"
            className="text-sm text-[#0D2959]/70 hover:text-[#0D2959]"
          >
            Contact
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-[#0D2959] focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 py-4">
          <div className="container mx-auto px-4 space-y-3">
            <a
              href="#how-it-works"
              className="block text-[#0D2959]/70 hover:text-[#0D2959]"
              onClick={() => setMenuOpen(false)}
            >
              How it Works
            </a>
            <a
              href="#pricing"
              className="block text-[#0D2959]/70 hover:text-[#0D2959]"
              onClick={() => setMenuOpen(false)}
            >
              Pricing
            </a>
            <a
              href="#faq"
              className="block text-[#0D2959]/70 hover:text-[#0D2959]"
              onClick={() => setMenuOpen(false)}
            >
              FAQ
            </a>
            <Link
              href="/contact"
              className="block text-[#0D2959]/70 hover:text-[#0D2959]"
              onClick={() => setMenuOpen(false)}
            >
              Contact
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
