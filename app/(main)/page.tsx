import Footer from "@/components/layout/footer";
import LandingPage from "@/components/home/landing-page";

export default function Home() {
  return (
    <div className="bg-background">
      <main>
        <LandingPage />
      </main>
      <Footer />
    </div>
  );
}
