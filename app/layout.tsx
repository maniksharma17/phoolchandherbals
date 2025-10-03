import './globals.css';
import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Toaster } from '@/components/ui/toaster';
import { SnackProvider } from '@/components/Snack';

export const metadata: Metadata = {
  title: 'Phoolchand Herbals',
  description: 'Ayurvedic healing since 1928',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script src="https://checkout.razorpay.com/v1/checkout.js" async></script>
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