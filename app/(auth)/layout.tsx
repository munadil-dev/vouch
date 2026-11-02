import { Geist } from "next/font/google";

const geist = Geist({ subsets: ["latin"], display: "swap" });

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`${geist.className} bg-background min-h-svh w-full`}>
      {children}
    </div>
  );
}
