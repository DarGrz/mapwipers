import Image from "next/image";
import Link from "next/link";

export default function LowRatedBusinesses() {
  return (
    <div className="min-h-screen bg-white text-black p-4 py-8 sm:p-8 font-[family-name:var(--font-geist-sans)]">
      <header className="flex flex-col items-center mb-8">
        <Link href="/">
          <Image
            src="/globe.svg"
            alt="Map Wipers logo"
            width={140}
            height={30}
            priority
          />
        </Link>
        <h1 className="text-2xl font-bold text-center mt-4">Find Low-Rated Google Business Profiles</h1>
        <p className="text-center text-gray-600 max-w-2xl mt-2">
          Discover businesses with poor ratings that might benefit from a profile reset
        </p>
      </header>
      
      <main className="max-w-5xl mx-auto">
        <div className="bg-gradient-to-br from-red-50 to-amber-50 p-8 rounded-xl shadow-sm mb-12">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold text-[#0D2959] mb-4">Why Reset Low-Rated Profiles?</h2>
              <p className="text-gray-700 mb-6">
                A low rating on Google can significantly impact your business. Studies show that 88% of consumers trust online reviews as much as personal recommendations, and businesses with 1-2 stars lose 90% of potential customers.
              </p>
              <div className="space-y-3">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-red-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <p className="text-gray-700">Low ratings are often the result of competitor attacks or isolated incidents</p>
                </div>
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <p className="text-gray-700">Resetting your profile gives you a fresh start without the negative baggage</p>
                </div>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <svg className="w-8 h-8 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <h3 className="text-xl font-semibold">Warning Signs</h3>
                </div>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="font-bold text-red-500 mr-2">•</span>
                    Your business has a rating below 3.5 stars
                  </li>
                  <li className="flex items-start">
                    <span className="font-bold text-red-500 mr-2">•</span>
                    You&apos;ve received multiple 1-star reviews in a short period
                  </li>
                  <li className="flex items-start">
                    <span className="font-bold text-red-500 mr-2">•</span>
                    Reviews contain false information or come from suspicious accounts
                  </li>
                  <li className="flex items-start">
                    <span className="font-bold text-red-500 mr-2">•</span>
                    Your listing appears with outdated or incorrect information
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
          <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-center">Search for Low-Rated Businesses</h2>
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200 mb-8">
              <h2 className="text-xl font-semibold mb-4">Find Low-Rated Businesses Near You</h2>
              
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      placeholder="City, state, or zip code"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#0D2959] focus:border-[#0D2959]"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Business Category
                    </label>
                    <select
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#0D2959] focus:border-[#0D2959]"
                    >
                      <option value="">All Categories</option>
                      <option value="restaurants">Restaurants</option>
                      <option value="hotels">Hotels</option>
                      <option value="dentists">Dentists</option>
                      <option value="beauty">Beauty Salons</option>
                      <option value="auto">Auto Repair</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="px-6 py-2 bg-[#0D2959] hover:bg-opacity-90 text-white rounded-md shadow-sm"
                  >
                    Search Businesses
                  </button>
                </div>
              </form>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">How This Works</h3>
              <p className="text-gray-700 mb-4">
                Our tool helps you identify businesses with poor ratings that could benefit from a profile reset. Once you find a business that needs help:
              </p>
              <ol className="text-gray-700 space-y-2 list-decimal list-inside mb-4">
                <li>Search for the business by location and category</li>
                <li>Select the business from search results</li>
                <li>Our team will handle the removal and setup of a fresh profile</li>
                <li>You&apos;ll only pay after the service is successfully completed</li>
              </ol>
              <p className="text-sm text-gray-600">
                Note: This service is only for business owners or authorized representatives.
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-16">
          <h2 className="text-2xl font-bold mb-6 text-center">Success Stories: Before & After</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <h3 className="text-lg font-semibold mb-4">Local Restaurant</h3>
              <div className="flex mb-4">
                <div className="flex-1 p-4 bg-red-50 rounded-l-lg border-r border-gray-200">
                  <p className="font-medium text-center mb-2">Before</p>
                  <div className="flex justify-center">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="ml-1 text-lg font-bold text-red-500">2.1</span>
                    </div>
                  </div>
                  <p className="text-center text-sm text-gray-500 mt-1">(24 reviews)</p>
                </div>
                <div className="flex-1 p-4 bg-green-50 rounded-r-lg">
                  <p className="font-medium text-center mb-2">After</p>
                  <div className="flex justify-center">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="ml-1 text-lg font-bold text-green-500">4.7</span>
                    </div>
                  </div>
                  <p className="text-center text-sm text-gray-500 mt-1">(12 new reviews)</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm">
                &quot;After competitors left fake reviews, our rating dropped to 2.1. Map Wipers helped us reset, and we now have an authentic 4.7 rating!&quot;
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <h3 className="text-lg font-semibold mb-4">Dental Clinic</h3>
              <div className="flex mb-4">
                <div className="flex-1 p-4 bg-red-50 rounded-l-lg border-r border-gray-200">
                  <p className="font-medium text-center mb-2">Before</p>
                  <div className="flex justify-center">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="ml-1 text-lg font-bold text-red-500">1.9</span>
                    </div>
                  </div>
                  <p className="text-center text-sm text-gray-500 mt-1">(17 reviews)</p>
                </div>
                <div className="flex-1 p-4 bg-green-50 rounded-r-lg">
                  <p className="font-medium text-center mb-2">After</p>
                  <div className="flex justify-center">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="ml-1 text-lg font-bold text-green-500">4.8</span>
                    </div>
                  </div>
                  <p className="text-center text-sm text-gray-500 mt-1">(22 new reviews)</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm">
                &quot;A disgruntled ex-employee hurt our online reputation. After the reset, our happy patients helped build our genuine 4.8 star rating.&quot;
              </p>
            </div>
          </div>
        </div>
        
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold mb-4">Ready to Reset Your Business Profile?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-6">
            Take the first step toward rebuilding your online reputation and attracting new customers
          </p>
          <Link 
            href="/"
            className="px-6 py-3 bg-[#0D2959] hover:bg-opacity-90 text-white rounded-md shadow-md text-center font-medium inline-block"
          >
            Start Your Profile Reset
          </Link>
        </div>
      </main>
      
      <footer className="mt-16 py-8 border-t border-gray-200">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">About Map Wipers</h3>
              <p className="text-gray-600 text-sm">
                Professional Google Business Profile reset and removal service. We help businesses manage their online presence effectively.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Useful Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/#how-it-works" className="text-[#0D2959] hover:underline text-sm">How it Works</Link>
                </li>
                <li>
                  <Link href="#" className="text-[#0D2959] hover:underline text-sm">Pricing</Link>
                </li>
                <li>
                  <Link href="#" className="text-[#0D2959] hover:underline text-sm">Contact</Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <p className="text-gray-600 text-sm mb-2">Email: contact@mapwipers.com</p>
              <div className="flex space-x-4 mt-4">
                <a href="#" className="text-[#0D2959] hover:text-opacity-80">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                  </svg>
                </a>
                <a href="#" className="text-[#0D2959] hover:text-opacity-80">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                </a>
                <a href="#" className="text-[#0D2959] hover:text-opacity-80">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Map Wipers. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
