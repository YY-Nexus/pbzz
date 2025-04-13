"use client"

import { useEffect, useState } from "react"

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    // 设置婚礼日期 - 2025年4月15日 11:58
    const weddingDate = new Date("2025-04-15T11:58:00").getTime()

    const timer = setInterval(() => {
      const now = new Date().getTime()
      const difference = weddingDate - now

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        })
      } else {
        clearInterval(timer)
        // 婚礼已经开始
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <section className="py-16 px-4 md:px-6 bg-dark-400">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-display font-light text-light-100 mb-8">婚礼倒计时</h2>

        <div className="flex flex-wrap justify-center gap-4 md:gap-8">
          <div className="bg-dark-300 p-6 min-w-[120px]">
            <div className="text-4xl md:text-5xl font-display text-rose-300 mb-2">{timeLeft.days}</div>
            <div className="text-light-300 text-sm uppercase tracking-wider">天</div>
          </div>

          <div className="bg-dark-300 p-6 min-w-[120px]">
            <div className="text-4xl md:text-5xl font-display text-rose-300 mb-2">{timeLeft.hours}</div>
            <div className="text-light-300 text-sm uppercase tracking-wider">小时</div>
          </div>

          <div className="bg-dark-300 p-6 min-w-[120px]">
            <div className="text-4xl md:text-5xl font-display text-rose-300 mb-2">{timeLeft.minutes}</div>
            <div className="text-light-300 text-sm uppercase tracking-wider">分钟</div>
          </div>

          <div className="bg-dark-300 p-6 min-w-[120px]">
            <div className="text-4xl md:text-5xl font-display text-rose-300 mb-2">{timeLeft.seconds}</div>
            <div className="text-light-300 text-sm uppercase tracking-wider">秒</div>
          </div>
        </div>
      </div>
    </section>
  )
}
