import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Healthy Life - Oral Hygiene & Personal Health Tracker",
  description: "Track your health scores, set daily habits, build reminders, and complete interactive oral hygiene surveys all in one premium workspace.",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans selection:bg-teal-500 selection:text-white">
        {children}
        <Script id="register-sw" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                navigator.serviceWorker.getRegistrations().then(function(registrations) {
                  for (let registration of registrations) {
                    registration.unregister();
                    console.log('ServiceWorker unregistered on localhost');
                  }
                });
              } else {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(function(reg) {
                    console.log('ServiceWorker registration successful');
                  }).catch(function(err) {
                    console.log('ServiceWorker registration failed: ', err);
                  });
                });
              }
            }
          `}
        </Script>
      </body>
    </html>
  );
}
