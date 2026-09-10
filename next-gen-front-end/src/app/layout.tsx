import "./globals.css";
import { Poppins, Space_Grotesk } from "next/font/google";
import ToastProvider from "@/components/ui/toast-provider";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
  variable: "--font-poppins",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata = {
  title: "Next Gen | Empowering Campus Development",
  description:
    "A modern platform for students to develop skills, access mentorship, attend events, and earn certifications.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${poppins.variable} ${spaceGrotesk.variable}`}>
      {/*
       * Body: antialiased text-white.
       * Background color is set in globals.css (#050505 for outer shell gap,
       * or bg-black fallback for dashboard/admin pages via their own layout).
       * No overflow:hidden here — dashboard/admin routes need their own scroll.
       * The landing page uses .home-shell (position:fixed) which self-contains.
       */}
      <body className="antialiased text-white">
        {children}
        <ToastProvider />
      </body>
    </html>
  );
}
