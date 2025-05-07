import type {Metadata} from "next";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import {PrimeReactProvider} from "primereact/api";
import {Providers} from "./providers";
import Header from "@/components/Header";
import {Toaster} from "react-hot-toast";
import {AuthProvider} from "@/hooks/useAuth";
import {SearchProvider} from "@/hooks/useSearch";
import {Dosis} from "next/font/google";
import {Suspense} from "react";

const myFont = Dosis({
  weight: "400",
  subsets: ["latin"],
  variable: "--my-font-family",
});

export const metadata: Metadata = {
  title: "Magic Movies",
  description: "TriplePlay Studios",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const value = {
    ripple: true,
  };

  return (
    <html lang="en">
      <body className={myFont.className}>
      <Suspense fallback={<div>Loading...</div>}>
        <AuthProvider>
          <SearchProvider>
            <Providers>
              <Header/>
              <Toaster position="top-center"/>
              <PrimeReactProvider value={value}>
                {children}
              </PrimeReactProvider>
            </Providers>
          </SearchProvider>
        </AuthProvider>
      </Suspense>
      </body>
    </html>
  );
}
