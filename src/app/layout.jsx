import { AuthProvider } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import MouseTrail from '../components/MouseTrail';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../index.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'GV Computer Center | Best Computer Institute in Fazilnagar, Tamkuhi, Kasaya',
  description: 'GV Computer Center is the No.1 computer training institute near Fazilnagar, Tamkuhi, Kasaya, Kushinagar, and Padrauna. We offer DCA, ADCA, Tally, CCC, O Level & coding courses.',
  keywords: 'GV Computer Center, Best Computer Institute in Fazilnagar, Computer classes Tamkuhi Raj, Computer coaching Kasaya, Top computer center near me, DCA ADCA course in Kushinagar, Tally CCC O Level institute, Coding classes in Fazilnagar, Web Development Course UP, Dhanauji Kalon computer center, Patherwa computer institute, Padrauna computer classes, Seorahi IT center, best computer center in Kushinagar district',
  openGraph: {
    title: 'GV Computer Center | Top Institute in Fazilnagar, Tamkuhi & Kasaya',
    description: 'GV Computer Center is the top-rated computer training institute near Fazilnagar, Tamkuhi, Kasaya, and Kushinagar.',
    url: 'https://gvcomputer.in',
    siteName: 'GV Computer Center',
    images: [
      {
        url: '/gv-logo.jpg',
        width: 800,
        height: 600,
        alt: 'GV Computer Center Logo',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  icons: {
    icon: '/gv-logo.jpg',
    shortcut: '/gv-logo.jpg',
    apple: '/gv-logo.jpg',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "name": "GV Computer Center",
  "image": "https://gvcomputer.in/gv-logo.jpg",
  "@id": "https://gvcomputer.in",
  "url": "https://gvcomputer.in",
  "telephone": "+919838531365",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Sarda Complex, Babu Bazar Rd, Dhanauji Kalon",
    "addressLocality": "Fazilnagar",
    "addressRegion": "UP",
    "postalCode": "274401",
    "addressCountry": "IN"
  },
  "areaServed": [
    { "@type": "City", "name": "Fazilnagar" },
    { "@type": "City", "name": "Tamkuhi Raj" },
    { "@type": "City", "name": "Kasaya" },
    { "@type": "City", "name": "Kushinagar" },
    { "@type": "City", "name": "Padrauna" },
    { "@type": "City", "name": "Patherwa" },
    { "@type": "City", "name": "Seorahi" }
  ],
  "description": "Best computer institute in Fazilnagar, offering DCA, ADCA, Tally, CCC, O Level, and Coding classes."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.className} bg-gray-50 text-gray-900 font-sans antialiased min-h-screen flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200`}>
        <MouseTrail />
        <AuthProvider>
          <Navbar />
          <main className="flex-1 flex flex-col">
            {children}
          </main>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
        </AuthProvider>
      </body>
    </html>
  );
}
