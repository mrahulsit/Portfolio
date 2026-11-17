import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Experience from "@/components/sections/Experience";
import Projects from "@/components/sections/Projects";
import Skills from "@/components/sections/Skills";
import GithubSection from "@/components/sections/Github";
import Writing from "@/components/sections/Writing";
import Contact from "@/components/sections/Contact";
import BuildBand from "@/components/sections/BuildBand";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Experience />
      <Projects />
      <Skills />
      <GithubSection />
      <Writing />
      <BuildBand />
      <Contact />
    </>
  );
}
