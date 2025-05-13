import { HeroSection } from "@/components/hero-section/page";
import { FeaturesSectionDemo } from "@/components/mid-feature/page";
import { AnimatedTestimonialsDemo } from "@/components/team/page";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <FeaturesSectionDemo/>
      <AnimatedTestimonialsDemo/>
    </main>
  );
}