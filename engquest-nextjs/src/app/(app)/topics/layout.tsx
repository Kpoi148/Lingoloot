import { Newsreader } from "next/font/google";

const newsreader = Newsreader({
  subsets: ["latin", "vietnamese"],
  weight: ["600", "700"],
  variable: "--font-display",
  display: "swap",
});

export default function TopicsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className={`${newsreader.variable} min-h-screen`}>{children}</div>;
}
