import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { LanguageProvider } from '@/components/language-provider';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { AccessibilityWidget } from '@/components/accessibility-widget';
import { GlobalChatBot } from '@/components/global-chat-bot';

export const metadata: Metadata = {
  title: 'myScheme — National Platform for Government Schemes & Services',
  description:
    'A language-agnostic government scheme discovery portal with deterministic eligibility verification and multilingual citizen assistance.',
  keywords: [
    'myScheme',
    'Government Schemes',
    'PM-KISAN',
    'Ayushman Bharat',
    'Scholarship',
    'Citizen Portal'
  ]
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('scheme_navigator_theme');
                  if (saved === 'dark') {
                    document.documentElement.classList.add('dark');
                    document.documentElement.setAttribute('data-theme', 'dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.setAttribute('data-theme', 'light');
                  }
                } catch (e) {}
              })();
            `
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased selection:bg-blue-600 selection:text-white bg-white dark:bg-[#071324] text-slate-900 dark:text-white transition-colors duration-200">
        <ThemeProvider>
          <LanguageProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <AccessibilityWidget />
            <GlobalChatBot />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
