import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import ThemeProvider from "@/components/ThemeProvider/ThemeProvider";
import NextAuthProvider from "@/components/AuthProvider/AuthProvider";
import Toast from "@/components/Toast/Toast";
import ChatBot from "@/components/Aichatpot/ChatBot";
const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Munawara Hotel Management System",
  description: "A hotel management system for Munawara Hotel",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  openGraph: {
    title: "Munawara Hotel Management System",
    description: "A hotel management system for Munawara Hotel",
    url: "https://munawarahotel.com",
    siteName: "Munawara",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <ThemeProvider>
        <body className={poppins.className}>
          <NextAuthProvider>
            <Toast />
            <main className="flex flex-col min-h-screen">
              <Header />
              {children}
              <ChatBot />
              <Footer />
            </main>
          </NextAuthProvider>
        </body>
      </ThemeProvider>
    </html>
  );
}

