import type { Metadata } from "next";
import { Inter, Cinzel, MedievalSharp } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const cinzel = Cinzel({ subsets: ["latin"], variable: "--font-cinzel" });
const medievalSharp = MedievalSharp({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-medievalsharp"
});

export const metadata: Metadata = {
  title: "Azeroth Heroes",
  description: "Choose your champion from the legends of Azeroth",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${cinzel.variable} ${medievalSharp.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}
