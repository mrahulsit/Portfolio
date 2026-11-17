import type { Metadata, Viewport } from "next";
import { Fraunces, Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/lib/toast";
import { profile } from "@/lib/data";

const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--font-fraunces",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const grotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-grotesk",
  display: "swap",
});

const jbmono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jbmono",
  display: "swap",
});

const title = `${profile.name} — ${profile.role} | Full Stack Developer`;
const description =
  "Software Engineer building scalable web applications with React, Next.js, TypeScript, PostgreSQL and AI-powered features. Open to software engineering opportunities.";

export const metadata: Metadata = {
  metadataBase: new URL(profile.siteUrl),
  title,
  description,
  authors: [{ name: profile.name }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: profile.name,
    title,
    description,
    url: "/",
    locale: "en_US",
    images: [{ url: "/og-image.jpg", width: 1200, height: 1200 }],
  },
  twitter: {
    card: "summary",
    title,
    description:
      "Software Engineer building full-stack applications with React.js, Node.js, TypeScript and PostgreSQL.",
  },
  icons: {
    icon: [{ rel: "icon", url: "/favicon.svg", type: "image/svg+xml" }],
    apple: [{ rel: "apple-touch-icon", url: "/favicon.svg" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#0b3048",
  colorScheme: "light",
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.role,
  email: `mailto:${profile.email}`,
  url: profile.siteUrl,
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "Silicon University, Bhubaneswar",
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Rourkela",
    addressRegion: "Odisha",
    addressCountry: "IN",
  },
  knowsAbout: [
    "Full Stack Development",
    "React.js",
    "Next.js",
    "TypeScript",
    "PostgreSQL",
    "REST APIs",
    "Test Automation",
  ],
  sameAs: [profile.github, profile.linkedin, profile.blog],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
      </head>
      <body
        className={`${fraunces.variable} ${inter.variable} ${grotesk.variable} ${jbmono.variable} font-ui`}
      >
        <ToastProvider>
          <a className="skip" href="#main">
            Skip to content
          </a>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
