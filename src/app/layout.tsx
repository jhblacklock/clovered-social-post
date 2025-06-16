import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Social Media Post Genie",
  description: "Generate platform-ready social media content from your blog or URL.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
