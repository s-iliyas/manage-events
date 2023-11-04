import "./globals.css";

import type { Metadata } from "next";

import { Alegreya } from "next/font/google";

import Main from "../components/main";

const inter = Alegreya({ subsets: ["greek"] });

export const metadata: Metadata = {
  title: "Todo App",
  description: "Todo App For Event Management!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Main>{children}</Main>
      </body>
    </html>
  );
}
