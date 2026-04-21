import type { Metadata } from "next";
import { IBM_Plex_Mono, Orbitron } from "next/font/google";
import { headers } from "next/headers";
import { cookieToInitialState } from "wagmi";
import { Providers } from "@/components/providers";
import { getBaseAppId } from "@/lib/env";
import { config } from "@/lib/wagmi/config";
import "./globals.css";

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const baseAppId = getBaseAppId();

export const metadata: Metadata = {
  title: "Simple Battle Royale",
  description:
    "Survive the shrinking neon zone. Swipe to move. Daily check-in on Base.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ),
  openGraph: {
    title: "Simple Battle Royale",
    description: "Cyberpunk mini battle royale on Base.",
    images: ["/thumbnail.jpg"],
  },
  icons: {
    icon: "/app-icon.jpg",
    apple: "/app-icon.jpg",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieHeader = (await headers()).get("cookie") ?? undefined;
  const initialState = cookieToInitialState(config, cookieHeader);

  return (
    <html lang="en">
      <head>
        <meta name="base:app_id" content={baseAppId} />
      </head>
      <body
        className={`${orbitron.variable} ${ibmPlexMono.variable} min-h-dvh bg-[#050510] font-sans antialiased`}
      >
        <Providers initialState={initialState}>{children}</Providers>
      </body>
    </html>
  );
}
