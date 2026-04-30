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
      <body className="bg-black text-white antialiased font-sans">
        {children}
        <ToastProvider />
      </body>
    </html>
  );
}

