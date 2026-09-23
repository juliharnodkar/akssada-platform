import { Hero } from "@/components/home/Hero";
import { MissionSection } from "@/components/home/MissionSection";
import { FocusAreas } from "@/components/home/FocusAreas";
import { FeaturedInitiatives } from "@/components/home/FeaturedInitiatives";
import { GoalsSection } from "@/components/home/GoalsSection";
import { StoriesPreview } from "@/components/home/StoriesPreview";
import { GetInvolved } from "@/components/home/GetInvolved";
import { FinalCTA } from "@/components/home/FinalCTA";

export default function Home() {
  return (
    <main>
      <Hero />
      <MissionSection />
      <FocusAreas />
      <FeaturedInitiatives />
      <GoalsSection />
      <StoriesPreview />
      <GetInvolved />
      <FinalCTA />
    </main>
  );
}
