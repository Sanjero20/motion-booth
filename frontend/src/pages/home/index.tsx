import Footer from "@/layouts/Footer";
import Header from "@/layouts/Header";

import Hero from "./sections/Hero";
import HowItWorks from "./sections/HowItWorks";

function HomePage() {
  return (
    <div className="">
      <Header />

      <main>
        <Hero />
        <HowItWorks />
        {/* The moment before */}
        {/* Templates */}
        {/* Sharing */}
        {/* Faq */}
        {/* CTA Banner */}
      </main>

      <Footer />
    </div>
  );
}

export default HomePage;
