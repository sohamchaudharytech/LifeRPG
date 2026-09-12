import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://liferpg.onrender.com"),
  title: "Life RPG — Level Up Your Real Life",
  description:
    "Transform your real-world goals and daily habits into an epic RPG adventure. Earn XP, level up attributes, maintain daily streaks, and conquer your potential.",
  keywords: ["Life RPG", "Gamification", "Habit Tracker", "Productivity Game", "Self Improvement"],
  authors: [{ name: "Life RPG Team" }],
  openGraph: {
    title: "Life RPG — Level Up Your Real Life",
    description:
      "Transform your real-world goals and daily habits into an epic RPG adventure. Earn XP, level up attributes, and build your character.",
    url: "https://liferpg.onrender.com",
    siteName: "Life RPG",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Life RPG — Level Up Your Real Life",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Life RPG — Level Up Your Real Life",
    description: "Transform your daily goals into quests, earn XP, and level up your character.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="theme-color" content="#05060A" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="bg-background text-slate-100 min-h-screen antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-cyan-500 focus:text-black focus:font-bold focus:rounded-lg focus:shadow-lg focus:outline-none"
        >
          Skip to main content
        </a>
        <div id="main-content" tabIndex={-1} className="outline-none">
          {children}
        </div>
      </body>
    </html>
  );
}
