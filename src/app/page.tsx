import Bento from "@/components/Bento";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Manifesto from "@/components/Manifesto";
import Marquee from "@/components/Marquee";
import Nav from "@/components/Nav";
import ProjectShowcase from "@/components/ProjectShowcase";
import SectionHeading from "@/components/SectionHeading";
import { projects } from "@/lib/projects";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />

        <Marquee
          items={[
            "DROPPIE",
            "GATEKEEP",
            "TRYO",
            "CODING JUNGLE",
            "WA-REPEATER",
            "VEILPAY",
            "MORE UNCOOL THINGS LOADING",
            "NO COOKIES",
            "HANDMADE EYEBALLS",
            "JUST VIBES",
          ]}
        />

        <section id="wall" className="relative mx-auto max-w-[1400px] px-5 py-28 sm:px-8 lg:px-10">
          <SectionHeading
            index="01"
            kicker="THE WALL"
            title="the wall"
            sub="live experiments, each with its own corner of the internet. the status dots are real — this page pings them while you read this."
          />
          <div className="flex flex-col gap-36 pt-16 lg:gap-48">
            {projects.map((p, i) => (
              <ProjectShowcase key={p.slug} project={p} index={i} flip={i % 2 === 1} />
            ))}
          </div>
        </section>

        <Bento />
        <Manifesto />
      </main>
      <Footer />
    </>
  );
}
