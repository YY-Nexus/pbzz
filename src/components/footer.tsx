import { Heart, Mail, Phone, Calendar, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-dark-600 py-16 px-4 md:px-6 text-light-100">
      <div className="container mx-auto">
        {/* 婚礼信息部分 - 从首页移动到这里 */}
        <div className="text-center mb-16">
          <Heart className="inline-block text-rose-300 mb-6" size={48} />
          <h3 className="text-xl md:text-2xl text-rose-200 font-display font-light mb-4">我们诚挚地邀请您参加</h3>
          <h1 className="text-4xl md:text-6xl lg:text-7xl text-light-100 font-display font-light mb-6">
            彭勃 <span className="text-rose-300">&</span> 真真
          </h1>
          <p className="text-2xl md:text-3xl text-light-200 mb-8 font-display">2025年4月15日</p>

          <div className="flex flex-wrap justify-center gap-8 mb-12 mt-8">
            <div className="bg-dark-500 p-6 min-w-[200px] rounded">
              <Calendar className="text-rose-300 mx-auto mb-3" size={28} />
              <div className="text-light-300 text-sm uppercase tracking-wider mb-2">日期</div>
              <div className="text-xl text-light-100">2025年4月15日</div>
              <div className="text-sm text-light-300">星期二 11:58</div>
            </div>

            <div className="bg-dark-500 p-6 min-w-[200px] rounded">
              <MapPin className="text-rose-300 mx-auto mb-3" size={28} />
              <div className="text-light-300 text-sm uppercase tracking-wider mb-2">地点</div>
              <div className="text-xl text-light-100">兴艺坊烤鸭店</div>
              <div className="text-sm text-light-300">二楼水晶厅</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            <Link href="#details">
              <Button className="bg-rose-400 text-light-100 hover:bg-rose-500 rounded-none px-8 py-6">查看详情</Button>
            </Link>
            <Link href="#rsvp">
              <Button
                variant="outline"
                className="text-light-100 border-light-100 hover:bg-light-100/10 rounded-none px-8 py-6"
              >
                立即回复
              </Button>
            </Link>
          </div>
        </div>

        {/* 分隔线 */}
        <div className="border-t border-dark-400 mb-12"></div>

        {/* 原有的页脚内容 */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="flex items-center mb-6 md:mb-0">
            <Heart className="text-rose-300 mr-2" size={20} />
            <span className="font-display text-light-100 text-xl tracking-tight">彭勃 & 真真</span>
          </div>

          <div className="flex flex-col md:flex-row gap-4 md:gap-8">
            <div className="flex items-center">
              <Phone className="text-rose-300 mr-2" size={16} />
              <a
                href="tel:18211933342"
                className="text-light-300 text-sm hover:text-rose-300 transition-colors duration-200"
                aria-label="拨打电话 18211933342"
              >
                18211933342
              </a>
            </div>
            <div className="flex items-center">
              <Mail className="text-rose-300 mr-2" size={16} />
              <a
                href="mailto:pbzz.love@example.com"
                className="text-light-300 text-sm hover:text-rose-300 transition-colors duration-200"
                aria-label="发送邮件至 pbzz.love@example.com"
              >
                pbzz.love@example.com
              </a>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-dark-400 text-center">
          <p className="text-light-400 text-sm">
            Copyright©Just Once <span className="text-rose-300">❤</span> 彭勃 & 真真的婚礼 | PBZZ.LOVE
          </p>
        </div>
      </div>
    </footer>
  )
}
