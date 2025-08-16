import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" });

// TODO: Replace with your production domain (must be absolute for OG urls)
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://abledtaha.online";
const TITLE = "Syed Taha Rizwan — Developer";
const DESCRIPTION = "Web & Application Developer • Backend-first, Python-centric. Building clean APIs, robust backends, and pragmatic full‑stack apps.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: TITLE, template: "%s — STR" },
  description: DESCRIPTION,
  applicationName: "Portfolio",
  authors: [{ name: "Syed Taha Rizwan" }],
  creator: "Syed Taha Rizwan",
  keywords: [
    "Syed Taha Rizwan",
    "Developer",
    "Backend",
    "Python",
    "Django",
    "APIs",
    "Next.js",
    "React",
    "Portfolio",
  ],
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/",
    siteName: "STR Portfolio",
    images: [
      { url: "/images/og.jpg", width: 1200, height: 630, alt: "Syed Taha Rizwan — Developer" },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/images/og.jpg"],
    creator: "@abled_taha", // optional
  },
  icons: {
    icon: [
      { url: "/images/favicon.ico" },
      { url: "/images/icon.svg", type: "image/svg+xml" },
      { url: "/images/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/images/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/images/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: ["/images/favicon.ico"],
  },
  category: "technology",
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Syed Taha Rizwan",
    url: SITE_URL,
    sameAs: [
      "https://github.com/Abled-Taha",
      "https://instagram.com/abled_taha",
      "https://www.facebook.com/TahaRizwan03",
    ],
    jobTitle: "Web & Application Developer",
    knowsAbout: ["Python", "Django", "APIs", "Next.js", "React", "SQL", "MongoDB"],
  } as const;

  return (
    <html lang="en" className={`scroll-smooth ${inter.variable}`} suppressHydrationWarning>
      <head>
        {/* JSON-LD for rich snippet */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        {/* Skip link for a11y */}
        <a
          href="#home"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-3 focus:py-2 focus:text-black"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
