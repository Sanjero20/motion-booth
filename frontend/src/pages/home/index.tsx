import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";

import Hero from "./sections/Hero";
import HowItWorks from "./sections/HowItWorks";
import MomentBefore from "./sections/MomentBefore";
import Templates from "./sections/Templates";
import Sharing from "./sections/Sharing";
import FAQ from "./sections/FAQ";
import CTABanner from "./sections/CTABanner";

function HomePage() {
  return (
    <div className="">
      <Header />

      <main>
        <Hero />
        <HowItWorks />
        <MomentBefore />
        <Templates />
        <Sharing />
        <FAQ />
        <CTABanner />
      </main>

      <Footer />
    </div>
  );
}

export default HomePage;
