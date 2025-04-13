"use client"

import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import { motion, useAnimation, AnimatePresence } from "framer-motion"

export function WeddingScheduleSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const controls = useAnimation()
  const [isImageHovered, setIsImageHovered] = useState(false)
  const [activeTimepoint, setActiveTimepoint] = useState<number | null>(null)

  // 更新婚礼流程时间点
  const timepoints = [
    {
      time: "10:30",
      title: "宾客签到",
      description: "宾客抵达婚礼现场，在签到处签到并领取座位卡。我们准备了精美的伴手礼，感谢您的到来。",
    },
    {
      time: "11:30",
      title: "迎亲凯旋",
      description: "新郎与迎亲队伍抵达婚礼现场，伴随着欢快的音乐和热烈的气氛，迎接这喜庆的时刻。",
    },
    {
      time: "11:58",
      title: "典礼仪式",
      description: "婚礼仪式正式开始，新人入场，交换誓言和戒指，共同点燃婚礼蜡烛，象征着两个人生命的交融。",
    },
    {
      time: "13:00",
      title: "浪漫举杯",
      description: "婚宴开始，新人敬酒，分享甜蜜的爱情故事。精心准备的美食将为您带来味蕾的享受。",
    },
  ]

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return

      const { top } = sectionRef.current.getBoundingClientRect()
      const windowHeight = window.innerHeight

      if (top < windowHeight * 0.75) {
        controls.start("visible")
      }
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll() // Check on initial load

    return () => window.removeEventListener("scroll", handleScroll)
  }, [controls])

  return (
    <section id="schedule" ref={sectionRef} className="py-20 px-4 md:px-6 bg-dark-500 overflow-hidden relative">
      <div className="container mx-auto relative z-10">
        {/* 3D 标题栏 - 降低延迟 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={controls}
          variants={{
            visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
          }}
          className="text-center max-w-3xl mx-auto mb-12 md:mb-16"
        >
          <div className="inline-block relative mb-4 md:mb-6">
            <div className="absolute inset-0 bg-rose-500 rounded-lg transform translate-x-1 translate-y-1"></div>
            <div className="relative bg-dark-300 border-2 border-rose-400 rounded-lg px-6 py-2 md:px-8 md:py-3 shadow-xl">
              <h2 className="text-2xl md:text-4xl font-display font-light text-light-100">婚礼流程</h2>
            </div>
          </div>
          <p className="text-light-300 text-sm md:text-base">
            我们精心安排了婚礼的每一个环节，希望能为您带来难忘的体验。以下是婚礼当天的详细流程安排。
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          {/* 男主图片 - 添加交互动画，降低延迟 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={controls}
            variants={{
              visible: { opacity: 1, scale: 1, transition: { duration: 0.4, delay: 0.1 } },
            }}
            className="relative h-[400px] md:h-[600px] w-full bg-dark-800 rounded-lg overflow-hidden shadow-2xl"
            onMouseEnter={() => setIsImageHovered(true)}
            onMouseLeave={() => setIsImageHovered(false)}
            onTouchStart={() => setIsImageHovered(true)}
            onTouchEnd={() => setTimeout(() => setIsImageHovered(false), 1000)}
          >
            {/* 图片光效 */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-tr from-rose-500/20 to-transparent z-10 pointer-events-none"
              animate={{
                opacity: isImageHovered ? 0.8 : 0.3,
              }}
              transition={{ duration: 0.3 }}
            />

            {/* 主图 */}
            <motion.div
              animate={{
                scale: isImageHovered ? 1.05 : 1,
              }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="relative h-full w-full"
            >
              <Image src="/images/groom-formal-new.jpeg" alt="新郎正装照" fill className="object-contain" priority />
            </motion.div>

            {/* 悬停时显示的装饰元素 - 优化移动端体验 */}
            <AnimatePresence>
              {isImageHovered && (
                <>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute bottom-4 right-4 md:bottom-6 md:right-6 text-light-100 text-sm md:text-lg font-display z-20 bg-dark-900/60 px-3 py-1 md:px-4 md:py-2 rounded-full backdrop-blur-sm"
                  >
                    Pbzz.love
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-4 left-4 md:top-6 md:left-6 bg-dark-900/60 backdrop-blur-sm px-3 py-1 rounded-lg z-20"
                  >
                    <span className="text-rose-300 text-sm md:text-base font-display">星空下的绅士</span>
                  </motion.div>

                  {/* 四角装饰 - 移动端更小 */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{ duration: 0.2, delay: 0.05 }}
                    className="absolute top-3 left-3 md:top-4 md:left-4 w-8 h-8 md:w-12 md:h-12 border-t-2 border-l-2 border-rose-300 z-20"
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{ duration: 0.2, delay: 0.1 }}
                    className="absolute top-3 right-3 md:top-4 md:right-4 w-8 h-8 md:w-12 md:h-12 border-t-2 border-r-2 border-rose-300 z-20"
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{ duration: 0.2, delay: 0.15 }}
                    className="absolute bottom-3 left-3 md:bottom-4 md:left-4 w-8 h-8 md:w-12 md:h-12 border-b-2 border-l-2 border-rose-300 z-20"
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{ duration: 0.2, delay: 0.2 }}
                    className="absolute bottom-3 right-3 md:bottom-4 md:right-4 w-8 h-8 md:w-12 md:h-12 border-b-2 border-r-2 border-rose-300 z-20"
                  />

                  {/* 悬停时的额外装饰元素 - 移动端隐藏部分元素 */}
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2, delay: 0.25 }}
                    className="absolute top-1/4 right-4 md:right-6 transform -rotate-12 bg-dark-900/60 backdrop-blur-sm px-2 py-1 rounded z-20"
                  >
                    <span className="text-rose-200 text-xs md:text-sm font-display">2025.04.15</span>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2, delay: 0.3 }}
                    className="absolute bottom-1/4 left-4 md:left-6 transform rotate-6 bg-dark-900/60 backdrop-blur-sm px-2 py-1 rounded z-20"
                  >
                    <span className="text-rose-200 text-xs md:text-sm font-display">彭勃</span>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </motion.div>

          {/* 婚礼流程时间线 - 降低延迟 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={controls}
            variants={{
              visible: { opacity: 1, x: 0, transition: { duration: 0.4, delay: 0.2 } },
            }}
            className="space-y-6 md:space-y-8"
          >
            {timepoints.map((point, index) => (
              <motion.div
                key={index}
                className={`relative pl-6 md:pl-8 ${index < timepoints.length - 1 ? "border-l-2" : ""} ${
                  activeTimepoint === index ? "border-rose-400" : "border-rose-300/50"
                }`}
                onMouseEnter={() => setActiveTimepoint(index)}
                onMouseLeave={() => setActiveTimepoint(null)}
                onTouchStart={() => setActiveTimepoint(index)}
                onTouchEnd={() => setTimeout(() => setActiveTimepoint(null), 500)}
                whileHover={{ x: 3 }}
              >
                <motion.div
                  className={`absolute left-[-6px] md:left-[-8px] top-0 w-3 h-3 md:w-4 md:h-4 rounded-full ${
                    activeTimepoint === index ? "bg-rose-400 shadow-glow" : "bg-rose-300"
                  }`}
                  animate={{
                    scale: activeTimepoint === index ? [1, 1.2, 1] : 1,
                  }}
                  transition={{
                    duration: 0.4,
                    repeat: activeTimepoint === index ? Number.POSITIVE_INFINITY : 0,
                    repeatType: "reverse",
                  }}
                />

                <div className="relative">
                  <div className="relative inline-block mb-2">
                    <div
                      className={`absolute inset-0 bg-rose-500/70 rounded transform translate-x-0.5 translate-y-0.5 ${
                        activeTimepoint === index ? "opacity-100" : "opacity-50"
                      }`}
                    ></div>
                    <h3 className="relative bg-dark-400 border border-rose-400 rounded px-2 py-1 md:px-3 md:py-1 text-base md:text-xl font-display text-light-100">
                      {point.time} - {point.title}
                    </h3>
                  </div>

                  <motion.p
                    className="text-light-300 text-sm md:text-base"
                    animate={{
                      color: activeTimepoint === index ? "#fda4af" : "#e5e5e5",
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    {point.description}
                  </motion.p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* 底部装饰元素 - 降低延迟 */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={controls}
          variants={{
            visible: { opacity: 1, y: 0, transition: { duration: 0.4, delay: 0.3 } },
          }}
          className="mt-12 md:mt-16 text-center"
        >
          <div className="inline-block bg-dark-300 px-4 py-1 md:px-6 md:py-2 rounded-full relative">
            <div className="absolute inset-0 bg-rose-500/30 rounded-full transform translate-x-0.5 translate-y-0.5"></div>
            <p className="relative text-light-200 text-xs md:text-sm italic">
              "爱情是一场盛大的仪式，我们邀请您共同见证"
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
