import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import Header from "./components/Header";
import Footer from "./components/Footer";
import LocaleDebug from "./components/LocaleDebug";
import { LocaleProvider } from "./context/LocaleContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "MapWipers - Professional Google My Business Profile Removal",
    template: "%s | MapWipers"
  },
  description: "Remove fake Google My Business profiles with 98% success rate. Professional GMB removal service with 7-14 day completion guarantee. Protect your business reputation online.",
  keywords: ["Google My Business removal", "fake GMB profile", "business reputation", "profile removal service", "Google Business Profile", "reputation management"],
  authors: [{ name: "MapWipers" }],
  creator: "MapWipers",
  publisher: "MapWipers",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://mapwipers.com'),
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en-US',
    },
  },
  openGraph: {
    title: "MapWipers - Professional Google My Business Profile Removal",
    description: "Remove fake Google My Business profiles with 98% success rate. Professional GMB removal service with 7-14 day completion guarantee.",
    url: "https://mapwipers.com",
    siteName: "MapWipers",
    images: [
      {
        url: "/mapwipers_logo-horizontal.png",
        width: 1200,
        height: 630,
        alt: "MapWipers - Google My Business Profile Removal Service",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MapWipers - Professional Google My Business Profile Removal",
    description: "Remove fake Google My Business profiles with 98% success rate. Professional GMB removal service with 7-14 day completion guarantee.",
    images: ["/mapwipers_logo-horizontal.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google Tag Manager */}
        <Script
          id="gtm-script"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-T3GS7MB9');`
          }}
        />
        {/* End Google Tag Manager */}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden`}
      >
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe 
            src="https://www.googletagmanager.com/ns.html?id=GTM-T3GS7MB9"
            height="0" 
            width="0" 
            style={{display:'none', visibility:'hidden'}}
          ></iframe>
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        <Script
          id="Cookiebot"
          src="https://consent.cookiebot.com/uc.js"
          data-cbid="2ecc4883-3772-48cf-a6ac-37fb69de61cb"
          data-blockingmode="auto"
          strategy="beforeInteractive"
        />
        <div className="min-h-screen flex flex-col overflow-x-hidden">
          <LocaleProvider>
            <Header />
            <main className="flex-1 overflow-x-hidden">
              {children}
            </main>
            <Footer />
            <LocaleDebug />
          </LocaleProvider>
        </div>
      </body>
    </html>
  );
}
