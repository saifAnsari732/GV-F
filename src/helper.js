// Define API_URL dynamically to handle Node.js SSR IPv6 localhost resolution issues
const getBaseUrl = () => {
  // If running on the server (SSR), use 127.0.0.1 to avoid IPv6 '::1' ECONNREFUSED issues on Windows
  if (typeof window === 'undefined') {
    return process.env.NEXT_PUBLIC_API_URL?.replace('localhost', '127.0.0.1') || "https://gv-backend-6q4c.onrender.com";
  }
  // If running in the browser, use the standard NEXT_PUBLIC_API_URL (which uses localhost, passing CORS)
  return process.env.NEXT_PUBLIC_API_URL || "https://gv-backend-6q4c.onrender.com";
};

export const API_URL = getBaseUrl();