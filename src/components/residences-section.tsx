"use client"

import { useRef } from "react"
import { MapPin, Calendar, Clock } from "lucide-react"

export function WeddingDetailsSection() {
  const sectionRef = useRef<HTMLElement>(null)

  return (
    <section id="details" ref={sectionRef} className="py-20 px-4 md:px-6 bg-dark-400 overflow-hidden">
      <div className="container mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-light text-light-100 mb-6">婚礼详情</h2>
          <p className="text-light-300">
            我们诚挚地邀请您参加我们的婚礼，与我们共同见证这美好的时刻。以下是婚礼的详细信息，期待您的到来。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-dark-300 p-8 flex flex-col items-center text-center">
            <Calendar className="text-rose-300 mb-4" size={48} />
            <h3 className="text-xl font-display text-light-100 mb-4">日期</h3>
            <p className="text-light-300 mb-2">2025年4月15日</p>
            <p className="text-light-300">星期二</p>
          </div>

          <div className="bg-dark-300 p-8 flex flex-col items-center text-center">
            <Clock className="text-rose-300 mb-4" size={48} />
            <h3 className="text-xl font-display text-light-100 mb-4">时间</h3>
            <p className="text-light-300 mb-2">上午 11:58 - 仪式开始</p>
            <p className="text-light-300">中午 12:30 - 午宴</p>
          </div>

          <div className="bg-dark-300 p-8 flex flex-col items-center text-center">
            <MapPin className="text-rose-300 mb-4" size={48} />
            <h3 className="text-xl font-display text-light-100 mb-4">地点</h3>
            <p className="text-light-300 mb-2">兴艺坊烤鸭店二楼水晶厅</p>
            <p className="text-light-300">洛阳市涧西区天津路与景华路口西北角</p>
          </div>
        </div>

        {/* 场地信息 */}
        <div className="mt-12 bg-dark-300 p-8 rounded-md">
          <h3 className="text-2xl font-display text-light-100 mb-4 text-center">兴艺坊烤鸭店 - 水晶厅</h3>
          <p className="text-light-300 text-center mb-6">我们婚礼的举办地点，优雅而浪漫</p>
          <div className="flex justify-center items-center">
            <div className="bg-dark-400 p-6 rounded-md inline-flex items-center">
              <MapPin className="text-rose-300 mr-3" size={24} />
              <span className="text-light-200">洛阳市涧西区天津路与景华路口西北角</span>
            </div>
          </div>
        </div>

        {/* 添加场地地址和交通信息 */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-dark-300 p-8">
            <h3 className="text-xl font-display text-light-100 mb-4">交通指南</h3>
            <ul className="space-y-3 text-light-300">
              <li className="flex items-start">
                <span className="inline-block w-6 h-6 rounded-full bg-rose-400 text-light-100 flex items-center justify-center mr-3 mt-0.5">
                  1
                </span>
                <span>自驾：导航至"洛阳市涧西区天津路与景华路口西北角兴艺坊烤鸭店"</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-6 h-6 rounded-full bg-rose-400 text-light-100 flex items-center justify-center mr-3 mt-0.5">
                  2
                </span>
                <span>公交：乘坐15路、27路、56路公交车至"天津路景华路口"站下车，步行约3分钟可达</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-6 h-6 rounded-full bg-rose-400 text-light-100 flex items-center justify-center mr-3 mt-0.5">
                  3
                </span>
                <span>出租车：告知司机"涧西区天津路与景华路口兴艺坊烤鸭店"即可</span>
              </li>
            </ul>
          </div>

          <div className="bg-dark-300 p-8">
            <h3 className="text-xl font-display text-light-100 mb-4">场地设施</h3>
            <ul className="space-y-3 text-light-300">
              <li className="flex items-start">
                <span className="inline-block w-6 h-6 rounded-full bg-rose-400 text-light-100 flex items-center justify-center mr-3 mt-0.5">
                  ✓
                </span>
                <span>免费停车场，可容纳50辆车</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-6 h-6 rounded-full bg-rose-400 text-light-100 flex items-center justify-center mr-3 mt-0.5">
                  ✓
                </span>
                <span>水晶厅位于二楼，设有电梯</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-6 h-6 rounded-full bg-rose-400 text-light-100 flex items-center justify-center mr-3 mt-0.5">
                  ✓
                </span>
                <span>场地可容纳200位宾客，配备高端音响和投影设备</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-6 h-6 rounded-full bg-rose-400 text-light-100 flex items-center justify-center mr-3 mt-0.5">
                  ✓
                </span>
                <span>提供专业婚礼策划和现场服务</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
