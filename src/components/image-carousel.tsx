"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface ImageCarouselProps {
  images: {
    src: string
    alt: string
    caption?: string
    subcaption?: string
  }[]
  autoRotate?: boolean
  interval?: number
  showControls?: boolean
  showCaptions?: boolean
  className?: string
  aspectRatio?: "square" | "video" | "portrait" | "custom"
  height?: number
  objectFit?: "cover" | "contain" | "fill"
  objectPosition?: string
}

export function ImageCarousel({
  images,
  autoRotate = true,
  interval = 5000,
  showControls = true,
  showCaptions = true,
  className = "",
  aspectRatio = "video",
  height,
  objectFit = "cover",
  objectPosition = "center",
}: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const touchStartX = useRef<number | null>(null)

  const getHeightClass = () => {
    if (height) return `h-[${height}px]`

    switch (aspectRatio) {
      case "square":
        return "aspect-square"
      case "video":
        return "aspect-video"
      case "portrait":
        return "aspect-[3/4]"
      case "custom":
        return "h-full"
      default:
        return "aspect-video"
    }
  }

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  // 简化触摸事件处理逻辑，避免可能的错误

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    // 不在移动中处理滑动逻辑，只记录位置
    if (touchStartX.current === null) return
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return

    const touchEndX = e.changedTouches[0].clientX
    const diff = touchStartX.current - touchEndX

    // 如果滑动距离足够大，则切换图片
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextSlide() // 向左滑动，下一张
      } else {
        prevSlide() // 向右滑动，上一张
      }
    }

    touchStartX.current = null
  }

  useEffect(() => {
    if (autoRotate && images.length > 1) {
      timerRef.current = setInterval(() => {
        nextSlide()
      }, interval)
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [autoRotate, interval, images.length])

  // 如果只有一张图片，简化渲染
  if (images.length === 1) {
    return (
      <div className={`relative overflow-hidden rounded-md ${getHeightClass()} ${className}`}>
        <div className="relative w-full h-full">
          <Image
            src={images[0].src || "/placeholder.svg"}
            alt={images[0].alt}
            fill
            className={`object-${objectFit}`}
            style={{ objectPosition }}
            priority
          />

          {showCaptions && (images[0].caption || images[0].subcaption) && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-dark-900/90 to-transparent p-2 md:p-4 text-white">
              {images[0].caption && (
                <h3 className="text-sm md:text-lg font-display mb-0 md:mb-1">{images[0].caption}</h3>
              )}
              {images[0].subcaption && <p className="text-xs md:text-sm text-light-300">{images[0].subcaption}</p>}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div
      className={`relative overflow-hidden rounded-md ${getHeightClass()} ${className}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Images */}
      <div className="relative w-full h-full">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <Image
              src={image.src || "/placeholder.svg"}
              alt={image.alt}
              fill
              className={`object-${objectFit}`}
              style={{ objectPosition }}
              priority={index === 0}
            />

            {showCaptions && (image.caption || image.subcaption) && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-dark-900/90 to-transparent p-2 md:p-4 text-white">
                {image.caption && <h3 className="text-sm md:text-lg font-display mb-0 md:mb-1">{image.caption}</h3>}
                {image.subcaption && <p className="text-xs md:text-sm text-light-300">{image.subcaption}</p>}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Controls - 优化移动端体验 */}
      {showControls && images.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-1 md:left-2 top-1/2 -translate-y-1/2 z-20 bg-dark-900/50 hover:bg-dark-900/70 text-white rounded-full p-1"
            aria-label="Previous slide"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-1 md:right-2 top-1/2 -translate-y-1/2 z-20 bg-dark-900/50 hover:bg-dark-900/70 text-white rounded-full p-1"
            aria-label="Next slide"
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}

      {/* Indicators - 优化移动端体验 */}
      {images.length > 1 && (
        <div className="absolute bottom-1 md:bottom-2 left-1/2 transform -translate-x-1/2 z-20 flex space-x-1 md:space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full transition-colors ${
                index === currentIndex ? "bg-rose-300" : "bg-light-300/50"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
