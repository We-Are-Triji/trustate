import type { Metadata } from "next";
import { Geist, Geist_Mono, Arsenal_SC } from "next/font/google";
import ConfigureAmplify from "@/components/configure-amplify";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const arsenalSC = Arsenal_SC({
  variable: "--font-arsenal-sc",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "TruState - Login",
  description: "TruState - The Transaction Integrity Layer",
  icons: {
    icon: [
      { url: "/trustate-logo.png" },
      { url: "/trustate-logo.png", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/trustate-logo.png",
    apple: "/trustate-logo.png",
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
        className={`${geistSans.variable} ${geistMono.variable} ${arsenalSC.variable} antialiased`}
      >
        <ConfigureAmplify />
        {children}
      </body>
    </html>
  );
}
