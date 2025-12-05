import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
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
  title: "Ghosted - Track Job Application Ghosting",
  description: "Track which companies ghost you during job applications. See ghosting stats, get closure, and know you're not alone.",
  keywords: ["job search", "ghosting", "job applications", "career", "hiring", "recruiter"],
  openGraph: {
    title: "Ghosted - Track Job Application Ghosting",
    description: "44% of job seekers get ghosted. Track your applications and see you're not alone.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ghosted - Track Job Application Ghosting",
    description: "44% of job seekers get ghosted. Track your applications and see you're not alone.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
