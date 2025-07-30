"use client";

import GoogleProfileSearch from "./components/GoogleProfileSearch";
import { useState } from "react";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [gmbSelected, setGmbSelected] = useState(false);
  
  // Function to handle GMB selection state changes
  const handleGmbSelectionChange = (isSelected: boolean) => {
    setGmbSelected(isSelected);
  };

  return (
    <div className="min-h-screen bg-white text-black font-[family-name:var(--font-geist-sans)]">
      {/* Modern Minimalist Navbar */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-[#0D2959] flex items-center justify-center">
              <span className="text-white font-bold text-xs">MW</span>
            </div>
            <span className="font-semibold text-[#0D2959]">MapWipers</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#" className="text-sm text-[#0D2959]/70 hover:text-[#0D2959]">How it Works</a>
            <a href="#" className="text-sm text-[#0D2959]/70 hover:text-[#0D2959]">Pricing</a>
            <a href="#" className="text-sm text-[#0D2959]/70 hover:text-[#0D2959]">FAQ</a>
            <a href="#" className="text-sm text-[#0D2959]/70 hover:text-[#0D2959]">Contact</a>
          </div>
          
          <button className="hidden md:block px-6 py-2 bg-[#F17313] hover:bg-[#F17313]/90 text-white text-sm font-medium rounded-full transition-all">
            Start
          </button>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden text-[#0D2959] focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
        
        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 py-4">
            <div className="container mx-auto px-4 space-y-3">
              <a href="#" className="block text-[#0D2959]/70 hover:text-[#0D2959]">How it Works</a>
              <a href="#" className="block text-[#0D2959]/70 hover:text-[#0D2959]">Pricing</a>
              <a href="#" className="block text-[#0D2959]/70 hover:text-[#0D2959]">FAQ</a>
              <a href="#" className="block text-[#0D2959]/70 hover:text-[#0D2959]">Contact</a>
              <button className="mt-4 w-full px-4 py-2 bg-[#F17313] text-white text-sm font-medium rounded-full">
                Start
              </button>
            </div>
          </div>
        )}
      </nav>

      <div className="container mx-auto px-4 py-12 md:py-16">
        {gmbSelected ? (
          // When GMB is selected, show the component full width
          <div className="max-w-7xl mx-auto">
            <GoogleProfileSearch onSelectionChange={handleGmbSelectionChange} />
          </div>
        ) : (
          // Single column layout when no GMB is selected
          <div className="flex flex-col items-center justify-center max-w-4xl mx-auto">
            {/* Search Component */}
            <div className="w-full">
              <GoogleProfileSearch onSelectionChange={handleGmbSelectionChange} />
            </div>
          </div>
        )}
      </div>
      
      {!gmbSelected && (
        <main className="container mx-auto px-4 py-16 max-w-7xl">
          {/* Section divider */}
          <div className="w-20 h-1 bg-[#F17313] mx-auto mb-16"></div>
          
          {/* Process steps section with better styling */}
          <h2 className="text-3xl font-bold text-center mb-12 text-[#0D2959]">How We Work</h2>
          
          <div className="max-w-4xl mx-auto mb-20">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center bg-white p-6 rounded-lg shadow-sm border border-[#0D2959]/10 transition-transform hover:translate-y-[-5px]">
                <div className="w-16 h-16 bg-[#F17313]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-[#F17313] font-semibold text-xl">1</span>
                </div>
                <h3 className="font-semibold text-lg mb-3 text-[#0D2959]">Search</h3>
                <p className="text-[#0D2959]/70">Find your business in our search engine</p>
              </div>
              
              <div className="text-center bg-white p-6 rounded-lg shadow-sm border border-[#0D2959]/10 transition-transform hover:translate-y-[-5px]">
                <div className="w-16 h-16 bg-[#F17313]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-[#F17313] font-semibold text-xl">2</span>
                </div>
                <h3 className="font-semibold text-lg mb-3 text-[#0D2959]">Choose</h3>
                <p className="text-[#0D2959]/70">Select the service you need</p>
              </div>
              
              <div className="text-center bg-white p-6 rounded-lg shadow-sm border border-[#0D2959]/10 transition-transform hover:translate-y-[-5px]">
                <div className="w-16 h-16 bg-[#F17313]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-[#F17313] font-semibold text-xl">3</span>
                </div>
                <h3 className="font-semibold text-lg mb-3 text-[#0D2959]">Done</h3>
                <p className="text-[#0D2959]/70">Pay only after the profile or review is removed</p>
              </div>
            </div>
          </div>
        </main>
      )}
      
      <footer className={`bg-[#0D2959]/5 border-t border-[#0D2959]/10 py-12 ${gmbSelected ? 'mt-0' : 'mt-12'}`}>
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-full bg-[#0D2959] flex items-center justify-center">
                  <span className="text-white font-bold text-xs">MW</span>
                </div>
                <span className="font-semibold text-[#0D2959]">MapWipers</span>
              </div>
              <p className="text-sm text-[#0D2959]/70">
                Professional removal of harmful reviews and profiles from the internet.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium mb-4 text-[#0D2959]">Services</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-[#0D2959]/70 hover:text-[#F17313]">Review Removal</a></li>
                <li><a href="#" className="text-[#0D2959]/70 hover:text-[#F17313]">Profile Removal</a></li>
                <li><a href="#" className="text-[#0D2959]/70 hover:text-[#F17313]">Reputation Monitoring</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium mb-4 text-[#0D2959]">Company</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-[#0D2959]/70 hover:text-[#F17313]">About Us</a></li>
                <li><a href="#" className="text-[#0D2959]/70 hover:text-[#F17313]">Pricing</a></li>
                <li><a href="#" className="text-[#0D2959]/70 hover:text-[#F17313]">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium mb-4 text-[#0D2959]">Contact</h3>
              <p className="text-sm text-[#0D2959]/70 mb-2">contact@mapwipers.com</p>
              <p className="text-sm text-[#0D2959]/70">+48 123 456 789</p>
            </div>
          </div>
          
          <div className="pt-8 border-t border-[#0D2959]/10 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-xs text-[#0D2959]/70">© {new Date().getFullYear()} Map Wipers. All rights reserved.</p>
            <div className="flex gap-4 mt-4 sm:mt-0">
              <a href="#" className="text-xs text-[#0D2959]/70 hover:text-[#F17313]">Privacy Policy</a>
              <a href="#" className="text-xs text-[#0D2959]/70 hover:text-[#F17313]">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
