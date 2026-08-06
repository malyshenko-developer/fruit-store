import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { Header } from "@/widgets/header";
import { Footer } from "@/widgets/footer";

import { Providers } from "./providers";
import "./globals.css";

const inter = Inter({
    variable: "--font-sans",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Fruit Store — Apple products, reimagined",
    description: "An independent Apple products store.",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en" className={`${inter.variable} h-full antialiased`}>
        <body className="min-h-full flex flex-col font-sans">
        <Providers>
            <Header />
            <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-[60px]">{children}</main>
            <Footer />
        </Providers>
        </body>
        </html>
    );
}