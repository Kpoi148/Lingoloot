import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "LingoLoot",
  description: "Authentication for LingoLoot",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
