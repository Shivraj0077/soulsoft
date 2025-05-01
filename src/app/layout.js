import { Inter } from "next/font/google";
import "./globals.css";
import { Auth } from "@auth/core";
import { AuthProvider } from "./providers";
import Chatbot from "../../components/Chatbot";
import AnimatedBlackNavbar from "../../components/Navbar";


const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata = {
  title: "Soulsoft Infotech",
  description: "Software Solutions Company",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
       <body className={inter.className}>
      <AuthProvider>
        <Chatbot/>
        <AnimatedBlackNavbar/>
        {children}
        </AuthProvider>
      </body>
    </html>
  );
}
