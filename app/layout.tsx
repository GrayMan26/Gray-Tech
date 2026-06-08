import type { Metadata } from "next";
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ClientWrapper from "../components/ClientWrapper";

export const metadata: Metadata = {
  title: "GrayTech Inc | Friendly, local tech help—done right.",
  description: "Philadelphia-based tech services company. From printer setup to small-office servers, GrayTech Inc keeps your tech simple and reliable.",
  keywords: "tech support, Philadelphia, computer repair, printer setup, PC building, server maintenance",
  authors: [{ name: "GrayTech Inc" }],
  openGraph: {
    title: "GrayTech Inc | Friendly, local tech help—done right.",
    description: "Philadelphia-based tech services company. From printer setup to small-office servers, GrayTech Inc keeps your tech simple and reliable.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col antialiased">
        <ClientWrapper>
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </ClientWrapper>
      </body>
    </html>
  );
}
