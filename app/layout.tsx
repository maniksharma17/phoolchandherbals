import './globals.css';
import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Toaster } from '@/components/ui/toaster';
import { SnackProvider } from '@/components/Snack';

export const metadata: Metadata = {
  title: 'Phoolchand Herbals',
  description: 'Authentic Ayurvedic healing since 1928. Explore herbal medicines, supplements, and wellness products from a trusted 100-year-old brand.',
  icons: {
    icon: 'https://d2o15czky0tjjt.cloudfront.net/phoolchandherbals-logo+(1).jpg',            // default favicon
    shortcut: 'https://d2o15czky0tjjt.cloudfront.net/phoolchandherbals-logo+(1).jpg',  // for quick load
    apple: 'https://d2o15czky0tjjt.cloudfront.net/phoolchandherbals-logo+(1).jpg',  // for iOS home screen
  },
  openGraph: {
    title: 'Phoolchand Herbals',
    description:
      'Authentic Ayurvedic healing since 1928. Shop herbal remedies and wellness products.',
    url: 'https://www.phoolchandherbal.com',
    siteName: 'Phoolchand Herbals',
    images: [
      {
        url: 'https://d2o15czky0tjjt.cloudfront.net/pch-hero-main.png', 
        width: 1200,
        height: 630,
        alt: 'Phoolchand Herbals - Ayurvedic Healing since 1928',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Phoolchand Herbals',
    description:
      'Authentic Ayurvedic healing since 1928. Shop herbal remedies and wellness products.',
    images: ['/og-image.jpg'],
    creator: '@phoolchandherbals', 
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Razorpay checkout script */}
        <script
          src="https://checkout.razorpay.com/v1/checkout.js"
          async
        ></script>
      </head>
      <body className="min-h-screen bg-white">
        <Navbar />
        <main className="min-h-screen">
          <SnackProvider>{children}</SnackProvider>
        </main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
