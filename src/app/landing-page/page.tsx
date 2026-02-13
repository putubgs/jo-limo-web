import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import ValueProposition from "@/components/ValueProposition";
import FleetSection from "@/components/FleetSection";
import ConciergeSection from "@/components/ConciergeSection";
import ServicesSection from "@/components/ServicesSection";
import Footer from "@/components/LP-Footer";

export default function Home() {
  return (
    <div className="font-sans text-gray-800 bg-white">
      <Navigation />
      <HeroSection />
      <ValueProposition />
      <FleetSection />
      <ConciergeSection />
      <ServicesSection />
      <Footer />
    </div>
  );
}
