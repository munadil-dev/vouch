import { Geist } from "next/font/google";
import Navbar from "@/components/layout/navbar";

const geist = Geist({ subsets: ["latin"], display: "swap" });

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`${geist.className} bg-muted min-h-screen w-full`}>
      <Navbar />
      {children}
    </div>
  );
}
