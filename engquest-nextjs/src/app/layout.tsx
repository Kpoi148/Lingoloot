import "./globals.css";
import { Manrope } from "next/font/google";
import ThemeProvider from "@/components/providers/theme-provider";

export const metadata = {
  title: "LingoLoot",
  description: "Authentication for LingoLoot",
  icons: {
    icon: "/icons/icon",
    apple: "/icons/apple-icon",
  },
};

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${manrope.variable} min-h-screen antialiased font-[var(--font-body)]`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
