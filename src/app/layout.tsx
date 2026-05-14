import type { Metadata } from 'next';
import { DM_Sans } from 'next/font/google';
import './globals.css';

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-dm-sans',
});

export const metadata: Metadata = {
  title: {
    default: 'MediCore | Advanced Clinical Intelligence & Hospital Management',
    template: '%s | MediCore'
  },
  description: 'Enterprise-grade clinical management platform for real-time patient monitoring, digital health records, and institutional audit transparency.',
  keywords: ['Healthcare Information System', 'Hospital Management', 'Clinical Audit', 'Patient Records', 'MediCore'],
  icons: {
    icon: '/logoicon.png',
  },
};

import { Toaster } from 'sonner';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={dmSans.className}>
        {children}
        <Toaster position="bottom-right" richColors expand={true} />
      </body>
    </html>
  );
}
