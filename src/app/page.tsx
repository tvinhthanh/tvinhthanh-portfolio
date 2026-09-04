import { Footer } from "@/components/layout/footer";
import { Rail } from "@/components/navigation/rail";
import { ToTop } from "@/components/navigation/to-top";
import { Contact } from "@/components/sections/contact";
import { Experience } from "@/components/sections/experience";
import { Hero } from "@/components/sections/hero";
import { Intro } from "@/components/sections/intro";
import { Philosophy } from "@/components/sections/philosophy";
import { Projects } from "@/components/sections/projects";
import { Background, Stack } from "@/components/sections/stack";
import { World } from "@/components/world";

export default function Home() {
  return (
    <>
      <World />

      <div className="relative z-10 lg:pl-[var(--rail)]">
        <a
          href="#main"
          className="sr-only rounded-base bg-accent px-4 py-2 text-on-accent focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60]"
        >
          Skip to content
        </a>

        <Rail />
        <ToTop />

        <main id="main">
          <Hero />

          {/* Wave-quiet strip: paper closes over the scene so the document
              reads without competing motion behind it. */}
          <div className="quiet-strip px-5 sm:px-8 lg:px-16">
            <Intro />
            <Philosophy />
          </div>

          {/* Wave-visible: the projects breathe with the world behind them —
              this is the second of three deliberate exposures (hero → work →
              contact) that make the scene a signature, not a wallpaper. */}
          <div className="px-5 sm:px-8 lg:px-16">
            <Projects />
          </div>

          <div className="quiet-strip px-5 sm:px-8 lg:px-16">
            <Experience />
            <Stack />
            <Background />
          </div>

          <div className="px-5 pb-[var(--s-section)] sm:px-8 lg:px-16">
            <Contact />
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
