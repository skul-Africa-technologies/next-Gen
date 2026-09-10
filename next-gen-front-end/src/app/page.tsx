import Hero from "@/components/Hero";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import CampusGallery from "@/components/CampusGallery";
import Events from "@/components/Events";
import Hackathons from "@/components/Hackathons";
import Networking from "@/components/Networking";
import IconSidebar from "@/components/IconSidebar";

export default function Home() {
  return (
    /*
     * .home-shell  — fixed floating rounded container (see globals.css)
     * IconSidebar  — absolutely positioned glass pill on the left, floats over content
     * .main-scroll — full-width/height scrollable content column, no padding
     */
    <div className="home-shell">
      <IconSidebar />
      <main className="main-scroll" id="home">
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
    </div>
  );
}
