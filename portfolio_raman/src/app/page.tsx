import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import ResumeSearch from "@/components/ResumeSearch";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import GithubStats from "@/components/GithubStats";
import Skills from "@/components/Skills";
import Achievements from "@/components/Achievements";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="flex-1">
        <Hero />
        <Marquee />
        <About />
        <ResumeSearch />
        <Experience />
        <Projects />
        <GithubStats />
        <Skills />
        <Achievements />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
