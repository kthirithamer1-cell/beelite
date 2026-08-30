import type { Metadata } from 'next';
import { Poppins, Cairo } from 'next/font/google';
import { Providers } from '@/components/providers';
import './globals.css';

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
});

const cairo = Cairo({
  variable: '--font-cairo',
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  title: 'Be Elite مع الأستاذ بسام • تهنّى على ولدك ومستقبله بين إيدينا',
  description: 'المنصة الرسمية للأستاذ بسام في تونس: دروس خصوصية ومتابعة بيداغوجية متميزة لضمان التألق والنجاح في الإعدادي والباكالوريا.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${poppins.variable} ${cairo.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-white text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
