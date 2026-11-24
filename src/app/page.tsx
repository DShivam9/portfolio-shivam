import { Suspense } from "react";
import { Navbar } from "@/components/navigation/Navbar";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Music } from "@/components/sections/Music";
import {
  GitHubActivity,
  GitHubActivitySkeleton,
} from "@/components/sections/GitHubActivity";
import { TechStack } from "@/components/sections/TechStack";
import { Projects } from "@/components/sections/Projects";
import { Certifications } from "@/components/sections/Certifications";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-bg text-text">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Music />
        <Suspense fallback={<GitHubActivitySkeleton />}>
          <GitHubActivity />
        </Suspense>
        <TechStack />
        <Projects />
        <Certifications />
      </main>
      <Footer />
    </div>
  );
}
