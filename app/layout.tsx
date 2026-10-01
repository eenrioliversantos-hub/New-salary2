import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Calculateur Salaire Net Québec - Taux Horaire',
  description: 'Calculatrice de salaire net horaire et paie aux deux semaines pour le Québec, Canada. Calcul instantané des impôts provinciaux, fédéraux, RRQ, RQAP et AE.',
  keywords: [
    'calculateur salaire net quebec',
    'talon de paie quebec',
    'impot quebec 2026',
    'taux horaire net',
    'rrq rqap deduction',
    'abattement du quebec 16.5',
    'normes cnesst heures supplementaires',
    'cv format canadien ats',
    'simulateur reer celiapp',
  ],
  authors: [{ name: 'PaieNet Québec - Comité Fiscal & Salarial' }],
  creator: 'PaieNet Québec',
  publisher: 'PaieNet Québec',
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
    title: 'Calculateur Salaire Net Québec - Taux Horaire',
    description: 'Calculatrice de salaire net horaire et paie aux deux semaines pour le Québec, Canada. Calcul instantané des impôts provinciaux, fédéraux, RRQ, RQAP et AE.',
    type: 'website',
    locale: 'fr_CA',
    alternateLocale: ['pt_BR', 'en_CA'],
    siteName: 'PaieNet Québec',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Calculateur Salaire Net Québec - Taux Horaire',
    description: 'Calculatrice de salaire net horaire et paie aux deux semaines pour le Québec, Canada. Calcul instantané des impôts provinciaux, fédéraux, RRQ, RQAP et AE.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: 'Calculateur Salaire Net Québec - PaieNet',
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'All',
        browserRequirements: 'Requires JavaScript. Requires HTML5.',
        description:
          'Calculatrice officielle et indépendante de salaire net horaire et bihebdomadaire pour le Québec, Canada avec barèmes officiels 2025/2026.',
        offers: {
          '@type': 'Offer',
          price: '0.00',
          priceCurrency: 'CAD',
        },
      },
      {
        '@type': 'Organization',
        name: 'PaieNet Québec',
        url: 'https://paienet.qc.ca',
        logo: 'https://paienet.qc.ca/logo.png',
        description: 'Portail indépendant d’intelligence salariale, fiscale et d’emploi au Québec.',
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'customer support',
          email: 'contato@paienet.qc.ca',
        },
      },
    ],
  };

  return (
    <html lang="fr" className="h-full bg-slate-50 text-slate-900 antialiased overflow-x-clip">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans selection:bg-primary/20 selection:text-primary overflow-x-clip w-full max-w-full" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
