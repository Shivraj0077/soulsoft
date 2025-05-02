// Importing the Inter font from Google Fonts
import { Inter } from "next/font/google";
import Navbar from "../../components/Navbar";
import InlineNavbar from "../../components/Navbar";
// Importing global CSS styles
import "./globals.css";

// Importing authentication modules
import { AuthProvider } from "./providers"; // Custom context/provider for authentication

// Importing components
import Chatbot from "../../components/Chatbot"; // AI-powered chatbot
import AnimatedBlackNavbar, { NavbarDemo } from "../../components/Navbar"; // Animated black navigation bar 

// Configuring the Inter font with Latin subset and swap display strategy
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

// Metadata for SEO and browser tab info
export const metadata = {
  title: "Soulsoft Infotech",
  description: "Software Solutions Company",
};

// Root layout component wraps the entire app
export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      {/* Applying the Inter font to the body */}
      <body>
        {/* Wrapping the app in the AuthProvider to handle user authentication */}
        <AuthProvider>
          {/* Navigation bar visible across pages */}
     
          <InlineNavbar/>
          {/* Main content wrapper with proper spacing */}
          <main className="pt-16 min-h-screen">
            {/* Rendering the individual page components */}
            {children}
          </main>
          
          {/* Persistent chatbot across all pages */}
        
        </AuthProvider>
      </body>
    </html>
  );
}