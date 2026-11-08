import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme";
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
    icon: [
      { rel: "icon", url: "/favicon-light.svg", media: "(prefers-color-scheme: light)" },
      { rel: "icon", url: "/favicon-dark.svg", media: "(prefers-color-scheme: dark)" },
      { rel: "icon", url: "/favicon-light.svg" },
    ],
    apple: [
      { rel: "apple-touch-icon", url: "/favicon-light.svg", media: "(prefers-color-scheme: light)" },
      { rel: "apple-touch-icon", url: "/favicon-dark.svg", media: "(prefers-color-scheme: dark)" },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f5f0" },
    { media: "(prefers-color-scheme: dark)", color: "#17150f" },
  ],
};

const themeScript = `(function(){try{var s=localStorage.getItem('theme');var t=s||(window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark');document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`;

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
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
      </head>
      <body className={`${fraunces.variable} ${inter.variable} font-ui`}>
        <ThemeProvider>
          <ToastProvider>
            <a className="skip" href="#main">
              Skip to content
            </a>
            {children}
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
