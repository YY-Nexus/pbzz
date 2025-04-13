"use client"

import { useRef } from "react"
import { Heart } from "lucide-react"
import Image from "next/image"

export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null)

  return (
    <section id="story" ref={sectionRef} className="py-20 px-4 md:px-6 bg-dark-500 overflow-hidden">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <Heart className="inline-block text-rose-300 mb-4" size={32} />
          <h2 className="text-3xl md:text-4xl font-display font-light text-light-100 mb-6">我们的故事</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="transition-transform duration-300 ease-out">
            <h3 className="text-2xl font-display font-light text-rose-300 mb-6">相遇、相知、相爱</h3>
            <p className="text-light-300 mb-6">
              我们的故事始于2018年的一个偶然相遇。那是一个普通的周末，在朋友的生日聚会上，我们第一次见面。当时的一个眼神交流，一次不经意的谈话，就此埋下了爱情的种子。
            </p>
            <p className="text-light-300 mb-6">
              在接下来的日子里，我们一起看过无数次日出日落，走过城市的每一个角落，分享彼此的喜怒哀乐。从最初的陌生到如今的相知相惜，我们一路走来，共同成长。
            </p>
            <p className="text-light-300">
              2024年的春天，在我们相识的第六年，他在我们第一次约会的地方单膝跪地，向我求婚。当时的感动与幸福，至今难以忘怀。现在，我们决定携手走向婚姻的殿堂，开始人生的新篇章。
            </p>
          </div>

          <div className="relative h-[600px] w-full">
            <Image src="/images/couple-outdoor-main.jpeg" alt="幸福的一对新人" fill className="object-contain" />
          </div>
        </div>
      </div>
    </section>
  )
}
