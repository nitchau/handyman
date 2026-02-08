import {
  Navbar,
  Hero,
  AudienceTiles,
  HowItWorks,
  TrustStrip,
  Footer,
} from "@/components/landing";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <AudienceTiles />
        <HowItWorks />
        <TrustStrip />
      </main>
      <Footer />
    </div>
  );
}
