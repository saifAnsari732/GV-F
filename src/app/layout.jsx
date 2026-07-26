import { AuthProvider } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import MouseTrail from '../components/MouseTrail';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../index.css';
import { Inter } from 'next/font/google';
import { FaWhatsapp } from 'react-icons/fa';

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
    "streetAddress": "Near SBI Bank Left side Sarda Complex Babu Bazar",
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

const jobSchemaLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "GV Computer Center",
  "url": "https://gvcomputer.in",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://gvcomputer.in/jobs?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
};

const placementSchemaLd = {
  "@context": "https://schema.org",
  "@type": "EmploymentAgency",
  "name": "GV Computer Center - Job Placement Cell",
  "url": "https://gvcomputer.in/jobs",
  "telephone": "+919838531365",
  "description": "Job placement assistance for computer course graduates in Fazilnagar, Tamkuhi Raj, Kasaya, Kushinagar, Padrauna and nearby districts.",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Near SBI Bank Left side Sarda Complex Babu Bazar",
    "addressLocality": "Fazilnagar",
    "addressRegion": "Uttar Pradesh",
    "postalCode": "274401",
    "addressCountry": "IN"
  },
  "areaServed": [
    { "@type": "City", "name": "Fazilnagar" },
    { "@type": "City", "name": "Tamkuhi Raj" },
    { "@type": "City", "name": "Kasaya" },
    { "@type": "City", "name": "Kushinagar" },
    { "@type": "City", "name": "Padrauna" },
    { "@type": "City", "name": "Gorakhpur" },
    { "@type": "City", "name": "Deoria" }
  ]
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jobSchemaLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(placementSchemaLd) }}
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
        
        {/* Floating WhatsApp Button */}
        <div className="fixed bottom-6 right-6 z-50 flex items-center justify-center group">
          {/* Glowing pulse rings */}
          <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-30"></div>
          <div className="absolute inset-0 rounded-full bg-green-400 blur-md opacity-40 animate-pulse"></div>
          
          <a 
            href="https://wa.me/919838531365" 
            target="_blank" 
            rel="noopener noreferrer"
            className="relative bg-gradient-to-tr from-green-600 to-green-400 hover:from-green-500 hover:to-green-300 text-white p-4 rounded-full shadow-[0_0_25px_rgba(34,197,94,0.6)] hover:shadow-[0_0_35px_rgba(34,197,94,0.8)] hover:-translate-y-1 hover:scale-110 transition-all duration-300 flex items-center justify-center border border-green-300/30"
          >
            <FaWhatsapp className="text-3xl drop-shadow-md" />
            <span className="absolute right-full mr-4 bg-white text-gray-800 text-sm font-bold py-2 px-4 rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.1)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap border border-gray-100 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Chat with us
            </span>
          </a>
        </div>
      </body>
    </html>
  );
}
