"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"

interface ImageCarouselProps {
  images: string[]
  interval?: number
  autoRotate?: boolean
  height?: string
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({
  images,
  interval = 3000,
  autoRotate = true,
  height = "300px",
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
  }, [images.length])

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
  }, [autoRotate, interval, images.length, nextSlide])

  const goToSlide = (slideIndex: number) => {
    setCurrentIndex(slideIndex)
  }

  return (
    <div style={{ height: height, position: "relative", overflow: "hidden" }}>
      <div
        style={{
          height: "100%",
          display: "flex",
          transition: "transform 0.5s ease-in-out",
          transform: `translateX(-${currentIndex * 100}%)`,
        }}
      >
        {images.map((image, index) => (
          <img
            key={index}
            src={image || "/placeholder.svg"}
            alt={`Slide ${index + 1}`}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              flexShrink: 0,
            }}
          />
        ))}
      </div>

      <div
        style={{
          position: "absolute",
          bottom: "10px",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
        }}
      >
        {images.map((_, index) => (
          <div
            key={index}
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor: index === currentIndex ? "white" : "gray",
              margin: "0 5px",
              cursor: "pointer",
            }}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  )
}

export default ImageCarousel
