"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Heart } from "lucide-react"

export function HeroSection() {
  const parallaxRef = useRef<HTMLDivElement>(null)
  const [isHeartHovered, setIsHeartHovered] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (!parallaxRef.current) return

      const scrollPosition = window.scrollY
      const translateY = scrollPosition * 0.5

      parallaxRef.current.style.transform = `translateY(${translateY}px)`
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <section className="relative min-h-screen overflow-hidden bg-black">
      {/* 背景图片 - 使用新提供的户外照片作为背景 */}
      <div ref={parallaxRef} className="absolute inset-0">
        <Image
          src="/images/couple-outdoor-main.jpeg"
          alt="彭勃和翟真真的婚纱照"
          fill
          className="object-contain md:object-cover"
          style={{ objectPosition: "center top" }}
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-dark-900/30 via-transparent to-dark-900/70" />
      </div>

      {/* 添加装饰元素 */}
      <div className="absolute bottom-10 right-10 text-light-100/80 text-xl font-display hidden md:block">
        PBZZ.LOVE
      </div>

      {/* 添加心形动画 - 在女主左手前面 */}
      <div className="absolute left-1/4 bottom-1/3 z-10">
        <div
          className="relative"
          onMouseEnter={() => setIsHeartHovered(true)}
          onMouseLeave={() => setIsHeartHovered(false)}
          onTouchStart={() => setIsHeartHovered(true)}
          onTouchEnd={() => setTimeout(() => setIsHeartHovered(false), 1000)}
        >
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
            }}
            className="cursor-pointer"
          >
            <Heart
              size={40}
              className="text-rose-400 filter drop-shadow-lg"
              fill="#fb7185"
              onClick={() => document.querySelector(".wish-notes-trigger")?.dispatchEvent(new MouseEvent("click"))}
            />
          </motion.div>

          {/* 悬停提示 */}
          <AnimatePresence>
            {isHeartHovered && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-dark-800/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg whitespace-nowrap"
              >
                <div className="text-light-100 text-sm font-display">月老的觅语小纸条</div>
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-3 h-3 bg-dark-800/90"></div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
