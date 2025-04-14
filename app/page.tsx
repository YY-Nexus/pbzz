"use client"

import { useEffect } from "react"
import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { AboutSection } from "@/components/about-section"
import { WeddingDetailsSection } from "@/components/residences-section"
import { WeddingScheduleSection } from "@/components/design-section"
import { GallerySection } from "@/components/gallery-section"
import { RSVPSection } from "@/components/contact-section"
import { CountdownTimer } from "@/components/countdown-timer"
import { Footer } from "@/components/footer"
import { WishNotes } from "@/components/wish-notes"
import { MusicPlayer } from "@/components/music-player"

export default function Home() {
  // Add smooth scroll behavior for anchor links
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const anchor = target.closest('a[href^="#"]')

      if (anchor) {
        e.preventDefault()
        const targetId = anchor.getAttribute("href")

        if (targetId && targetId !== "#") {
          const targetElement = document.querySelector(targetId)

          if (targetElement) {
            window.scrollTo({
              top: targetElement.getBoundingClientRect().top + window.scrollY - 80, // Offset for header
              behavior: "smooth",
            })
          }
        }
      }
    }

    document.addEventListener("click", handleAnchorClick)

    return () => {
      document.removeEventListener("click", handleAnchorClick)
    }
  }, [])

  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <HeroSection />
      <CountdownTimer />
      <AboutSection />
      <WeddingDetailsSection />
      <WeddingScheduleSection />
      <GallerySection />
      <RSVPSection />
      <Footer />
      <WishNotes />
      <MusicPlayer />
    </main>
  )
}
