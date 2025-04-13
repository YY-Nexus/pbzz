"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Check, Heart } from "lucide-react"

export function RSVPSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    attendance: "yes",
    guests: "0",
    message: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // 这里可以添加表单提交逻辑
    console.log("表单数据:", formData)
    setSubmitted(true)
  }

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current || !formRef.current) return

      const { top } = sectionRef.current.getBoundingClientRect()
      const windowHeight = window.innerHeight

      if (top < windowHeight * 0.75) {
        formRef.current.style.opacity = "1"
        formRef.current.style.transform = "translateY(0)"
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <section id="rsvp" ref={sectionRef} className="py-20 px-4 md:px-6 bg-dark-500">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Heart className="inline-block text-rose-300 mb-4" size={32} />
          <h2 className="text-3xl md:text-4xl font-display font-light text-light-100 mb-6">回复邀请</h2>
          <p className="text-light-300">
            请在2025年5月15日前回复您是否能够参加我们的婚礼。您的到来将是对我们最好的祝福。
          </p>
        </div>

        {submitted ? (
          <div className="bg-dark-400 p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-400 mb-6">
              <Check className="text-white" size={32} />
            </div>
            <h3 className="text-2xl font-display text-light-100 mb-4">感谢您的回复！</h3>
            <p className="text-light-300 mb-6">
              我们已收到您的回复信息，非常期待在婚礼当天与您相见。如有任何问题或需要更改回复信息，请随时与我们联系。
            </p>
            <Button
              onClick={() => setSubmitted(false)}
              className="bg-rose-400 hover:bg-rose-500 text-light-100 rounded-none px-8 py-6"
            >
              修改回复
            </Button>
          </div>
        ) : (
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="space-y-6 opacity-0 transform translate-y-10 transition-all duration-1000 ease-out"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-light-200 mb-1">
                  姓名
                </label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="请输入您的姓名"
                  required
                  className="rounded-none bg-dark-400 border-dark-300 focus:border-rose-300 focus:ring-rose-300 text-light-100"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-light-200 mb-1">
                  邮箱
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="请输入您的邮箱"
                  required
                  className="rounded-none bg-dark-400 border-dark-300 focus:border-rose-300 focus:ring-rose-300 text-light-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-light-200 mb-1">
                  电话
                </label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="请输入您的联系电话"
                  required
                  className="rounded-none bg-dark-400 border-dark-300 focus:border-rose-300 focus:ring-rose-300 text-light-100"
                />
              </div>
              <div>
                <label htmlFor="attendance" className="block text-sm font-medium text-light-200 mb-1">
                  是否参加
                </label>
                <select
                  id="attendance"
                  name="attendance"
                  value={formData.attendance}
                  onChange={handleChange}
                  className="w-full rounded-none bg-dark-400 border-dark-300 focus:border-rose-300 focus:ring-rose-300 text-light-100 p-2"
                >
                  <option value="yes">我会参加</option>
                  <option value="no">很遗憾，无法参加</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="guests" className="block text-sm font-medium text-light-200 mb-1">
                随行人数
              </label>
              <select
                id="guests"
                name="guests"
                value={formData.guests}
                onChange={handleChange}
                className="w-full rounded-none bg-dark-400 border-dark-300 focus:border-rose-300 focus:ring-rose-300 text-light-100 p-2"
              >
                <option value="0">仅自己</option>
                <option value="1">+1 人</option>
                <option value="2">+2 人</option>
                <option value="3">+3 人</option>
                <option value="4">+4 人</option>
              </select>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-light-200 mb-1">
                留言祝福
              </label>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="请写下您对新人的祝福"
                rows={5}
                className="rounded-none bg-dark-400 border-dark-300 focus:border-rose-300 focus:ring-rose-300 text-light-100"
              />
            </div>

            <Button
              type="submit"
              className="bg-rose-400 hover:bg-rose-500 text-light-100 rounded-none px-8 py-6 w-full md:w-auto"
            >
              提交回复
            </Button>
          </form>
        )}
      </div>
    </section>
  )
}
