import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import SimpleMusicPlayer from "@/components/simple-music-player"

export default function Home() {
  return (
    <main className="min-h-screen relative">
      {/* Hero Section with Background Image */}
      <div className="relative h-screen flex items-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="/placeholder.svg?height=1080&width=1920"
            alt="Wedding Background"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Content overlay */}
        <div className="container mx-auto relative z-10 flex flex-col items-end justify-center h-full pr-12">
          <h1 className="text-6xl font-serif text-white mb-4">彭勃 & 翟真真</h1>
          <p className="text-2xl text-white mb-8">2025年4月15日</p>
          <div className="flex gap-4">
            <Button
              asChild
              variant="outline"
              className="bg-white/10 backdrop-blur-sm border-white text-white hover:bg-white/20"
            >
              <Link href="/details">查看详情</Link>
            </Button>
            <Button asChild className="bg-white text-black hover:bg-white/90">
              <Link href="/rsvp">立即回复</Link>
            </Button>
          </div>
        </div>

        {/* 添加音乐播放器 - 放在右下角 */}
        <div className="absolute bottom-8 right-8 z-20">
          <SimpleMusicPlayer />
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black/80 text-white py-12">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-8 md:mb-0">
              <h2 className="text-3xl font-serif mb-4">兴艺坊烤鸭店 - 水晶厅</h2>
              <p className="text-lg">我们婚礼的举办地点，优雅而浪漫</p>
            </div>
            <nav>
              <ul className="flex flex-wrap gap-6">
                <li>
                  <Link href="/story" className="hover:underline">
                    我们的故事
                  </Link>
                </li>
                <li>
                  <Link href="/details" className="hover:underline">
                    婚礼详情
                  </Link>
                </li>
                <li>
                  <Link href="/schedule" className="hover:underline">
                    婚礼流程
                  </Link>
                </li>
                <li>
                  <Link href="/gallery" className="hover:underline">
                    照片墙
                  </Link>
                </li>
                <li>
                  <Link href="/rsvp" className="hover:underline">
                    回复邀请
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </footer>
    </main>
  )
}
