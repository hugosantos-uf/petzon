import React from "react";
import HeroSection from "@/app/components/layout/HeroSection";
import HowItWorksSection from "@/app/components/layout/HowItWorksSection";
import TestimonialsSection from "@/app/components/layout/TestimonialsSection";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col">
      <HeroSection />
      <HowItWorksSection />
      <TestimonialsSection />
    </main>
  );
}
