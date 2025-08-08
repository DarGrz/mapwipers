import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - MapWipers | Data Protection & Security",
  description: "Learn how MapWipers protects your data during Google My Business profile removal services. Comprehensive privacy policy for our GMB removal platform.",
  keywords: ["privacy policy", "data protection", "security", "MapWipers privacy", "GMB removal privacy"],
  openGraph: {
    title: "Privacy Policy - MapWipers",
    description: "Learn how MapWipers protects your data during Google My Business profile removal services.",
    url: "https://mapwipers.com/privacy",
  },
  alternates: {
    canonical: '/privacy',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
