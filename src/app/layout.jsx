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
  description: 'GV Computer Center is the top-rated computer training institute near Fazilnagar, Tamkuhi, Kasaya, and Kushinagar. We offer advanced DCA, ADCA, Tally, and coding courses. Enroll now!',
  keywords: 'GV Computer Center, Computer Institute in Fazilnagar, Computer classes Tamkuhi, Computer coaching Kasaya, Best computer center near me, DCA ADCA course in Kushinagar, Coding classes in Fazilnagar, Web Development Course UP',
  openGraph: {
    title: 'GV Computer Center | Best Computer Institute in Fazilnagar, Tamkuhi, Kasaya',
    description: 'GV Computer Center is the top-rated computer training institute near Fazilnagar, Tamkuhi, Kasaya, and Kushinagar.',
    url: 'https://gv-frontend-six.vercel.app',
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

export default function RootLayout({ children }) {
  return (
    <html lang="en">
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
