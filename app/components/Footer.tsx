import Image from 'next/image';
import Link from 'next/link';

interface FooterProps {
  className?: string;
}

export default function Footer({ className = "" }: FooterProps) {
  return (
    <footer className={`bg-[#0D2959]/5 border-t border-[#0D2959]/10 py-12 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Image 
                src="/mapwipers_logo-horizontal.png" 
                alt="MapWipers Logo" 
                width={120} 
                height={35}
                className="h-8 w-auto"
              />
            </div>
            <p className="text-sm text-[#0D2959]/70">
              Professional removal of harmful reviews and profiles from the
              internet.
            </p>
          </div>

          <div>
            <h3 className="font-medium mb-4 text-[#0D2959]">Services</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#"
                  className="text-[#0D2959]/70 hover:text-[#F17313]"
                >
                  GMB Removal
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-[#0D2959]/70 hover:text-[#F17313]"
                >
                  Profile Removal
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-[#0D2959]/70 hover:text-[#F17313]"
                >
                  Reputation Monitoring
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-4 text-[#0D2959]">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#"
                  className="text-[#0D2959]/70 hover:text-[#F17313]"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-[#0D2959]/70 hover:text-[#F17313]"
                >
                  Pricing
                </a>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-[#0D2959]/70 hover:text-[#F17313]"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-4 text-[#0D2959]">Contact</h3>
            <p className="text-sm text-[#0D2959]/70 mb-2">
              support@mapwipers.com
            </p>
            {/* <p className="text-sm text-[#0D2959]/70">+48 571 767 999</p> */}
          </div>
        </div>

        <div className="pt-8 border-t border-[#0D2959]/10 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-xs text-[#0D2959]/70">
            © {new Date().getFullYear()} Map Wipers. All rights reserved.
          </p>
          <div className="flex gap-4 mt-4 sm:mt-0">
            <Link
              href="/privacy"
              className="text-xs text-[#0D2959]/70 hover:text-[#F17313]"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-xs text-[#0D2959]/70 hover:text-[#F17313]"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
