import { Suspense } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { HeroSection } from "@/components/sections/hero-section"
import { AboutSection } from "@/components/sections/about-section"
import { SkillsSection } from "@/components/sections/skills-section"
import { ProjectsSection } from "@/components/sections/projects-section"
import { ContactSection } from "@/components/sections/contact-section"
import CalendlyTest from '@/components/CalendlyTest'

function HomeContent() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ProjectsSection />
      <ContactSection />
      <CalendlyTest />
    </>
  )
}

export default function Home() {
  return (
    <MainLayout>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
        <HomeContent />
      </Suspense>
    </MainLayout>
  )
}

