import {
  Navbar,
  Hero,
  AudienceTiles,
  HowItWorks,
  InspirationBanner,
  TrustStrip,
  Footer,
} from "@/components/landing";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <AudienceTiles />
        <InspirationBanner />
        <HowItWorks />
        <TrustStrip />
      </main>
      <Footer />
    </div>
  );
}
