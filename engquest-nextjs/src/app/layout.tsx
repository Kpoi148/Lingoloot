import "./globals.css";

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
        {children}
      </body>
    </html>
  );
}
