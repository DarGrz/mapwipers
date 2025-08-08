import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us - MapWipers | Google My Business Profile Removal Support",
  description: "Get expert help with Google My Business profile removal. Contact MapWipers for fast, professional GMB removal services. 24/7 support available.",
  keywords: ["contact MapWipers", "GMB removal support", "Google Business Profile help", "business reputation assistance"],
  openGraph: {
    title: "Contact MapWipers - GMB Removal Support",
    description: "Get expert help with Google My Business profile removal. Professional support for fake profile removal and reputation management.",
    url: "https://mapwipers.com/contact",
    images: [
      {
        url: "/mapwipers_logo-horizontal.png",
        width: 1200,
        height: 630,
        alt: "Contact MapWipers - GMB Removal Support",
      },
    ],
  },
  twitter: {
    title: "Contact MapWipers - GMB Removal Support",
    description: "Get expert help with Google My Business profile removal. Professional support for fake profile removal.",
  },
  alternates: {
    canonical: '/contact',
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
