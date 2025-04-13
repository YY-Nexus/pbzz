"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X, Heart } from "lucide-react"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY
      if (offset > 50) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-dark-900/90 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex justify-between items-center py-6 px-4 md:px-6">
        {/* 更新标题中的名称 */}
        <Link href="/" className="flex items-center gap-2">
          <Heart className="text-rose-300" size={20} />
          <span className="font-display text-light-100 text-2xl tracking-tight">彭勃 & 真真</span>
        </Link>

        {/* Mobile menu button */}
        <button className="md:hidden text-light-100" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop navigation - 修改为每项4个字 */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="#story"
            className="text-light-100 hover:text-rose-300 text-sm uppercase tracking-wider font-display font-light"
          >
            甜蜜故事
          </Link>
          <Link
            href="#details"
            className="text-light-100 hover:text-rose-300 text-sm uppercase tracking-wider font-display font-light"
          >
            婚礼详情
          </Link>
          <Link
            href="#schedule"
            className="text-light-100 hover:text-rose-300 text-sm uppercase tracking-wider font-display font-light"
          >
            幸福流程
          </Link>
          <Link
            href="#gallery"
            className="text-light-100 hover:text-rose-300 text-sm uppercase tracking-wider font-display font-light"
          >
            爱的相册
          </Link>
          <Link
            href="#rsvp"
            className="text-light-100 hover:text-rose-300 text-sm uppercase tracking-wider font-display font-light"
          >
            诚挚邀请
          </Link>
        </nav>
      </div>

      {/* Mobile menu - 修改为每项4个字 */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-dark-900/95 backdrop-blur-md z-50">
          <nav className="flex flex-col p-4">
            <Link
              href="#story"
              className="py-3 text-light-100 hover:text-rose-300 text-sm uppercase tracking-wider font-display font-light"
              onClick={() => setIsMenuOpen(false)}
            >
              甜蜜故事
            </Link>
            <Link
              href="#details"
              className="py-3 text-light-100 hover:text-rose-300 text-sm uppercase tracking-wider font-display font-light"
              onClick={() => setIsMenuOpen(false)}
            >
              婚礼详情
            </Link>
            <Link
              href="#schedule"
              className="py-3 text-light-100 hover:text-rose-300 text-sm uppercase tracking-wider font-display font-light"
              onClick={() => setIsMenuOpen(false)}
            >
              幸福流程
            </Link>
            <Link
              href="#gallery"
              className="py-3 text-light-100 hover:text-rose-300 text-sm uppercase tracking-wider font-display font-light"
              onClick={() => setIsMenuOpen(false)}
            >
              爱的相册
            </Link>
            <Link
              href="#rsvp"
              className="py-3 text-light-100 hover:text-rose-300 text-sm uppercase tracking-wider font-display font-light"
              onClick={() => setIsMenuOpen(false)}
            >
              诚挚邀请
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
