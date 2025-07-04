import React from "react";
import HeroSection from "@/app/components/HeroSection";
import HowItWorksSection from "@/app/components/HowItWorksSection";
import TestimonialsSection from "@/app/components/TestimonialsSection";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col">
      <HeroSection />
      <HowItWorksSection />
      <TestimonialsSection />
    </main>
  );
}
