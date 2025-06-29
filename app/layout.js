import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/Components/Footer";
import Navbar from "@/Components/Navbar";
import AutoLogout from '@/Components/AutoLogout';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "TKE ITS INDIA",
  description: "ready to rock",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
    >
      <body className="flex flex-col min-h-screen">
        <Navbar />
        <AutoLogout />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
