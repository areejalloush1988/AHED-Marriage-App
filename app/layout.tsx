import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AHED | عَهْد",
  description:
    "عَهْد — مساحة للزواج الإسلامي الجاد تبدأ بالنية الواضحة وتحفظ الخصوصية.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
