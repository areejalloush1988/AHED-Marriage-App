import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://ahedmarriage.com"),
  title: {
    default: "عَهْد | منصة زواج جاد وموثوق",
    template: "%s | عَهْد",
  },
  description:
    "عَهْد منصة للزواج الجاد تقوم على وضوح النية، الخصوصية، مراجعة الملفات، والقبول المتبادل قبل التواصل.",
  applicationName: "AHED | عَهْد",
  manifest: "/site.webmanifest",
  keywords: [
    "زواج جاد",
    "منصة زواج",
    "عهد للزواج",
    "AHED Marriage",
    "زواج موثوق",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "ar_AE",
    url: "/",
    siteName: "AHED | عَهْد",
    title: "عَهْد | منصة زواج جاد وموثوق",
    description:
      "مساحة تحفظ الخصوصية وتجمع أصحاب النية الواضحة ضمن رحلة زواج جادة ومحترمة.",
  },
  twitter: {
    card: "summary",
    title: "عَهْد | منصة زواج جاد وموثوق",
    description:
      "منصة للزواج الجاد تقوم على الخصوصية والقبول المتبادل قبل التواصل.",
  },
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
