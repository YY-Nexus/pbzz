"use client"

import { useState, useRef } from "react"
import { ImageCarousel } from "./image-carousel"
import { Heart, Camera, Star, Play, Maximize2, Download, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function GallerySection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [hoveredButton, setHoveredButton] = useState<string | null>(null)

  // 第一个分类：彭彭❤（原彭勃❤）
  const pengpengImages = [
    {
      src: "/images/couple-outdoor-1.jpeg",
      alt: "户外写真1",
      caption: "彭彭❤",
      subcaption: "2024年夏天，自然风光",
    },
    {
      src: "/images/couple-outdoor-4.jpeg",
      alt: "户外写真4",
      caption: "彭彭❤",
      subcaption: "2024年夏天，胶片风格",
    },
    {
      src: "/images/couple-spotlight-1.jpeg",
      alt: "星光婚纱照1",
      caption: "彭彭❤",
      subcaption: "2024年冬天，星光闪耀",
    },
    {
      src: "/images/couple-spotlight-2.jpeg",
      alt: "星光婚纱照2",
      caption: "彭彭❤",
      subcaption: "2024年冬天，永恒时刻",
    },
  ]

  // 第二个分类：❤女子❤（原❤真真）
  const ladyImages = [
    {
      src: "/images/couple-frame.png",
      alt: "相框照片",
      caption: "❤女子❤",
      subcaption: "2024年，精致装裱",
    },
    {
      src: "/images/couple-envelope.jpeg",
      alt: "信封照片",
      caption: "❤女子❤",
      subcaption: "2024年，创意构图",
    },
    {
      src: "/images/couple-studio-1.jpeg",
      alt: "工作室照片1",
      caption: "❤女子❤",
      subcaption: "2024年，专业摄影",
    },
  ]

  // 第三个分类：❤真真（原❤女子❤）
  const zhenzhenImages = [
    {
      src: "/images/bride-solo.jpeg",
      alt: "新娘写真",
      caption: "❤真真",
      subcaption: "2024年冬天，如梦如幻",
    },
    {
      src: "/images/bride-portrait.jpeg",
      alt: "新娘写真",
      caption: "❤真真",
      subcaption: "2024年冬天，如梦如幻",
    },
    {
      src: "/images/groom-portrait.jpeg",
      alt: "新郎写真",
      caption: "❤真真",
      subcaption: "2024年冬天，星光闪耀",
    },
    {
      src: "/images/groom-formal-new.jpeg",
      alt: "新郎正装照",
      caption: "❤真真",
      subcaption: "2024年，正式写真",
    },
  ]

  // 所有横版照片合集
  const allHorizontalImages = [...pengpengImages, ...ladyImages]

  // 更新分类按钮
  const categories = [
    { id: "pengpeng", name: "彭彭❤", icon: <Heart size={18} /> },
    { id: "lady", name: "❤女子❤", icon: <Star size={18} /> },
    { id: "zhenzhen", name: "❤真真", icon: <Play size={18} /> },
  ]

  // 修改默认选中的分类
  const [activeCategory, setActiveCategory] = useState<string>("pengpeng")

  // 根据当前选择的分类过滤照片
  const getFilteredImages = () => {
    switch (activeCategory) {
      case "pengpeng":
        return pengpengImages
      case "lady":
        return ladyImages
      case "zhenzhen":
        return zhenzhenImages
      default:
        return pengpengImages // 默认显示彭彭❤分类
    }
  }

  // 照片操作按钮
  const photoActions = [
    { id: "view", name: "查看大图", icon: <Maximize2 size={16} /> },
    { id: "download", name: "下载", icon: <Download size={16} /> },
    { id: "share", name: "分享", icon: <Share2 size={16} /> },
  ]

  return (
    <section id="gallery" ref={sectionRef} className="py-16 md:py-20 px-4 md:px-6 bg-dark-400 overflow-hidden">
      <div className="container mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-8 md:mb-12">
          <div className="inline-block bg-dark-300 px-4 py-1 md:px-6 md:py-2 rounded-full mb-4 md:mb-6">
            <h2 className="text-2xl md:text-4xl font-display font-light text-light-100">照片墙</h2>
          </div>
          <p className="text-light-300 text-sm md:text-base mb-6 md:mb-8">
            分享我们爱情旅程中的美好瞬间，记录下我们一路走来的点点滴滴。
          </p>
        </div>

        {/* 分类按钮 - 优化移动端显示 */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-8 md:mb-10">
          {categories.map((category) => (
            <Button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              onMouseEnter={() => setHoveredButton(category.id)}
              onMouseLeave={() => setHoveredButton(null)}
              className={cn(
                "rounded-full transition-all duration-200 transform text-xs md:text-sm",
                activeCategory === category.id
                  ? "bg-rose-400 text-white px-3 md:px-6 py-1 md:py-2"
                  : "bg-dark-300 text-light-300 hover:bg-dark-200 px-2 md:px-4 py-1 md:py-2",
                hoveredButton === category.id && "scale-105",
              )}
            >
              <span className="mr-1 md:mr-2">{category.icon}</span>
              {category.name}
            </Button>
          ))}
        </div>

        {/* 照片展示区域 - 优化移动端显示 */}
        {activeCategory === "zhenzhen" ? (
          // 竖版照片展示 - ❤真真
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
            {zhenzhenImages.map((image, index) => (
              <div key={index} className="flex flex-col group">
                <div className="bg-dark-300 p-1 md:p-2 rounded-t-md">
                  <h4 className="text-sm md:text-lg font-display text-light-100 text-center">{image.caption}</h4>
                </div>
                <div className="relative aspect-[3/4] w-full bg-dark-500 overflow-hidden">
                  <ImageCarousel
                    images={[image]}
                    autoRotate={false}
                    showControls={false}
                    showCaptions={false}
                    aspectRatio="portrait"
                    objectFit="contain"
                  />
                  <div className="absolute inset-0 bg-dark-900/70 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-1 md:gap-2">
                    {photoActions.map((action) => (
                      <Button
                        key={action.id}
                        size="sm"
                        className="bg-rose-400 hover:bg-rose-500 text-white rounded-full p-1 md:p-2"
                        title={action.name}
                      >
                        {action.icon}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="bg-dark-300 p-1 md:p-2 rounded-b-md">
                  <p className="text-xs md:text-sm text-light-300 text-center">{image.subcaption}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // 横版照片展示 - 优化移动端显示
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
            {getFilteredImages().map((image, index) => (
              <div key={index} className="flex flex-col group">
                <div className="bg-dark-300 p-1 md:p-2 rounded-t-md">
                  <h4 className="text-sm md:text-lg font-display text-light-100 text-center">{image.caption}</h4>
                </div>
                <div className="relative aspect-video w-full bg-dark-500 overflow-hidden">
                  <ImageCarousel
                    images={[image]}
                    autoRotate={false}
                    showControls={false}
                    showCaptions={false}
                    aspectRatio="video"
                    objectFit="contain"
                  />
                  <div className="absolute inset-0 bg-dark-900/70 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-1 md:gap-2">
                    {photoActions.map((action) => (
                      <Button
                        key={action.id}
                        size="sm"
                        className="bg-rose-400 hover:bg-rose-500 text-white rounded-full p-1 md:p-2"
                        title={action.name}
                      >
                        {action.icon}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="bg-dark-300 p-1 md:p-2 rounded-b-md">
                  <p className="text-xs md:text-sm text-light-300 text-center">{image.subcaption}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 全部照片轮播 - 仅在大屏幕上显示 */}
        <div className="mt-12 md:mt-16 hidden lg:block">
          <div className="bg-dark-300 px-4 py-1 md:px-6 md:py-2 rounded-full mb-6 md:mb-8 mx-auto text-center max-w-max">
            <h3 className="text-xl md:text-2xl font-display text-light-100">精选照片</h3>
          </div>
          <div className="aspect-video max-w-4xl mx-auto">
            <ImageCarousel
              images={[pengpengImages[0], ladyImages[0], zhenzhenImages[0]]}
              autoRotate={true}
              interval={3000}
              aspectRatio="video"
              objectFit="contain"
              className="rounded-md shadow-xl"
            />
          </div>
        </div>

        {/* 照片墙底部按钮 - 优化移动端显示 */}
        <div className="mt-8 md:mt-12 flex justify-center">
          <Button
            className="bg-rose-400 hover:bg-rose-500 text-white rounded-full px-4 py-2 md:px-8 md:py-6 transition-all duration-200 transform hover:scale-105 text-sm md:text-base"
            onMouseEnter={() => setHoveredButton("more")}
            onMouseLeave={() => setHoveredButton(null)}
          >
            <Camera className="mr-1 md:mr-2" size={16} />
            查看更多照片
          </Button>
        </div>
      </div>
    </section>
  )
}
