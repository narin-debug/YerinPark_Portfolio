import Hero from "@/components/sections/Hero";
import StillsGallery from "@/components/sections/StillsGallery";
import Intro from "@/components/sections/Intro";
import ProjectGrid from "@/components/sections/ProjectGrid";
import ToolsBand from "@/components/sections/ToolsBand";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <main className="relative w-full bg-background">
      <Hero />
      <StillsGallery />
      <Intro />
      <ProjectGrid />
      <ToolsBand />
      <Contact />
    </main>
  );
}
