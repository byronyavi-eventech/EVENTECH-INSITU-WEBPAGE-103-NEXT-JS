import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "./components/navBar";
import Footer from "./components/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://laboratorioinsitu.cl"),
  title: "Laboratorio INSITU | Ensayos de Mecánica de Suelos, Hormigón y Asfalto",
  description:
    "Laboratorio INSITU ofrece servicios de ensayos de materiales e inspección técnica. Especialistas en mecánica de suelos, hormigones, asfalto, y obras viales bajo estándares INN-MINVU.",
  keywords: [
    "mecánica de suelos",
    "laboratorio de suelos",
    "ensayos de hormigón",
    "asfalto",
    "ensayos no destructivos",
    "minvu",
    "diseño marshall",
    "cbr",
    "proctor",
    "laboratorio insitu",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: "Laboratorio INSITU",
    title: "Laboratorio INSITU | Ensayos de Mecánica de Suelos, Hormigón y Asfalto",
    description:
      "Laboratorio INSITU ofrece servicios de ensayos de materiales e inspección técnica. Especialistas en mecánica de suelos, hormigones, asfalto, y obras viales bajo estándares INN-MINVU.",
    url: "https://laboratorioinsitu.cl",
  },
  twitter: {
    card: "summary_large_image",
    title: "Laboratorio INSITU | Ensayos de Mecánica de Suelos",
    description: "Especialistas en mecánica de suelos, hormigones, asfalto y obras viales.",
  },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-gray-50 text-white font-sans">
        <NavBar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
