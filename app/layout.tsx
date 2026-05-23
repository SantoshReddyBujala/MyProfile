import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Santosh Bujala - Senior Software Engineer",
  description:
    "Full-stack software engineer with 12+ years of experience in web, mobile, and backend systems.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
