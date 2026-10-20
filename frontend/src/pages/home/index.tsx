import Footer from "@/layouts/Footer";
import Header from "@/layouts/Header";

import Hero from "./sections/Hero";
import HowItWorks from "./sections/HowItWorks";
import MomentBefore from "./sections/MomentBefore";
import Templates from "./sections/Templates";

function HomePage() {
  return (
    <div className="">
      <Header />

      <main>
        <Hero />
        <HowItWorks />
        <MomentBefore />
        <Templates />
        {/* Sharing */}
        {/* Faq */}
        {/* CTA Banner */}
      </main>

      <Footer />
    </div>
  );
}

export default HomePage;
