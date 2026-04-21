import Hero from "@/components/Hero";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import CampusGallery from "@/components/CampusGallery";
import Navbar from "@/components/Navbar";
import Events from "@/components/Events";
import Hackathons from "@/components/Hackathons";
import Networking from "@/components/Networking";

export default function Home() {
  return (
    <main className="flex flex-col">
        <Navbar />
      <Hero />
      <Features />
      <Hackathons />
      <Networking />
       <CampusGallery />
        <Events />
      <HowItWorks />
      <CTA />
      <Footer />
    </main>
  );
}
