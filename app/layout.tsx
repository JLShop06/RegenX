import type { Metadata, Viewport } from 'next';
import { Inter, Montserrat } from 'next/font/google';
import './globals.css';

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap',
});

const montserrat = Montserrat({
    subsets: ['latin'],
    variable: '--font-montserrat',
    display: 'swap',
});

export const metadata: Metadata = {
    title: {
      default: 'RegenX - Votre Coach IA Fitness & Bien-être',
          template: '%s | RegenX',
    },
    description: 'RegenX est votre coach personnel IA pour le fitness, la nutrition et la récupération. Programmes sport personnalisés, conseils CBD et compléments. 99€/mois.',
    keywords: ['coach fitness IA', 'programme sport personnalisé', 'nutrition sport', 'récupération sportive', 'CBD sport', 'compléments alimentaires'],
    authors: [{ name: 'RegenX' }],
    creator: 'RegenX',
    publisher: 'RegenX',
    robots: {
          index: true,
          follow: true,
          googleBot: {
                  index: true,
                  follow: true,
                  'max-video-preview': -1,
                  'max-image-preview': 'large',
                  'max-snippet': -1,
          },
    },
    openGraph: {
          type: 'website',
          locale: 'fr_FR',
          url: 'https://regenx.eu',
          title: 'RegenX - Votre Coach IA Fitness & Bien-être',
          description: 'Transformez votre corps avec RegenX. IA coach personnel, programmes sport, nutrition, CBD. 99€/mois.',
          siteName: 'RegenX',
          images: [
            {
                      url: '/og-image.jpg',
                      width: 1200,
                      height: 630,
                      alt: 'RegenX Coach IA',
            },
                ],
    },
    twitter: {
          card: 'summary_large_image',
          title: 'RegenX - Votre Coach IA Fitness & Bien-être',
          description: 'Coach IA personnel pour le fitness, nutrition et récupération. 99€/mois.',
          images: ['/og-image.jpg'],
    },
    alternates: {
          canonical: 'https://regenx.eu',
          languages: {
                  'fr': 'https://regenx.eu',
                  'de': 'https://de.regenx.eu',
                  'es': 'https://es.regenx.eu',
                  'en': 'https://en.regenx.eu',
          },
    },
    icons: {
          icon: '/favicon.ico',
          shortcut: '/favicon-16x16.png',
          apple: '/apple-touch-icon.png',
    },
    manifest: '/site.webmanifest',
};

export const viewport: Viewport = {
    themeColor: '#22c55e',
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
          <html lang="fr" className={`${inter.variable} ${montserrat.variable}`}>
                  <body className="bg-gray-950 text-white antialiased">
                    {children}
                  </body>body>
          </html>html>
        );
}
</body>
