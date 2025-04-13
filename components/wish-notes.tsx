"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Heart, Send, MessageSquare, RefreshCw, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

// 模拟的祝福数据
const initialWishes = [
  { id: 1, name: "李明", message: "祝福新人百年好合，永结同心！", date: "2025-03-15" },
  { id: 2, name: "张婷", message: "愿你们的爱情，如同美酒，历久弥香。", date: "2025-03-16" },
  { id: 3, name: "王强", message: "祝福你们携手走过每一个春夏秋冬，共同创造美好的未来！", date: "2025-03-18" },
  { id: 4, name: "赵雪", message: "愿你们的婚姻生活如同诗歌一般美丽，如同音乐一般和谐。", date: "2025-03-20" },
  { id: 5, name: "刘洋", message: "真心祝福你们，愿你们的爱情故事永远写不完。", date: "2025-03-22" },
]

export function WishNotes() {
  const [isOpen, setIsOpen] = useState(false)
  const [isWriting, setIsWriting] = useState(false)
  const [currentWish, setCurrentWish] = useState<(typeof initialWishes)[0] | null>(null)
  const [wishes, setWishes] = useState(initialWishes)
  const [newWish, setNewWish] = useState({ name: "", message: "" })
  const [isLoading, setIsLoading] = useState(false)
  const [animation, setAnimation] = useState("")
  const noteRef = useRef<HTMLDivElement>(null)

  // 随机获取一条祝福
  const getRandomWish = () => {
    if (wishes.length === 0) return null
    setIsLoading(true)
    setAnimation("out")

    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * wishes.length)
      setCurrentWish(wishes[randomIndex])
      setAnimation("in")
      setIsLoading(false)
    }, 600)
  }

  // 提交新祝福
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newWish.name.trim() || !newWish.message.trim()) return

    const today = new Date()
    const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(
      today.getDate(),
    ).padStart(2, "0")}`

    const newWishItem = {
      id: wishes.length + 1,
      name: newWish.name,
      message: newWish.message,
      date: formattedDate,
    }

    setWishes([...wishes, newWishItem])
    setNewWish({ name: "", message: "" })
    setIsWriting(false)

    // 显示刚刚添加的祝福
    setTimeout(() => {
      setCurrentWish(newWishItem)
      setAnimation("in")
    }, 300)
  }

  // 点击外部关闭弹窗
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (noteRef.current && !noteRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // 初始化时随机获取一条祝福
  useEffect(() => {
    if (isOpen && !currentWish && !isWriting) {
      getRandomWish()
    }
  }, [isOpen, currentWish, isWriting])

  return (
    <>
      {/* 悬浮按钮 - 添加类名以便于从其他组件触发点击 */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-rose-400 hover:bg-rose-500 text-white rounded-full p-3 shadow-lg transition-transform duration-300 hover:scale-110 wish-notes-trigger"
        aria-label="打开月老的觅语小纸条"
      >
        <MessageSquare size={24} />
      </button>

      {/* 弹出窗口 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              ref={noteRef}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-dark-300 rounded-lg shadow-xl max-w-md w-full overflow-hidden"
            >
              {/* 标题栏 - 更新标题为"月老的觅语小纸条" */}
              <div className="bg-dark-400 px-4 py-3 flex justify-between items-center">
                <div className="flex items-center">
                  <Heart className="text-rose-300 mr-2" size={18} />
                  <h3 className="text-light-100 font-display text-lg">月老的觅语小纸条</h3>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-light-300 hover:text-light-100"
                  aria-label="关闭"
                >
                  <X size={18} />
                </button>
              </div>

              {/* 内容区域 */}
              <div className="p-4">
                {isWriting ? (
                  // 写祝福表单
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-light-200 mb-1">
                        您的名字
                      </label>
                      <Input
                        id="name"
                        value={newWish.name}
                        onChange={(e) => setNewWish({ ...newWish, name: e.target.value })}
                        placeholder="请输入您的名字"
                        required
                        maxLength={10}
                        className="bg-dark-400 border-dark-500 text-light-100 focus:border-rose-300"
                      />
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-light-200 mb-1">
                        祝福内容
                      </label>
                      <Textarea
                        id="message"
                        value={newWish.message}
                        onChange={(e) => setNewWish({ ...newWish, message: e.target.value })}
                        placeholder="写下您对新人的祝福..."
                        required
                        maxLength={100}
                        rows={4}
                        className="bg-dark-400 border-dark-500 text-light-100 focus:border-rose-300"
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsWriting(false)}
                        className="border-light-300 text-light-300 hover:bg-dark-400"
                      >
                        取消
                      </Button>
                      <Button type="submit" className="bg-rose-400 hover:bg-rose-500 text-white">
                        <Send size={16} className="mr-2" />
                        发送祝福
                      </Button>
                    </div>
                  </form>
                ) : (
                  // 显示祝福内容
                  <div className="min-h-[200px] flex flex-col justify-between">
                    <div className="mb-4">
                      <AnimatePresence mode="wait">
                        {isLoading ? (
                          <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex justify-center items-center h-[120px]"
                          >
                            <RefreshCw size={24} className="text-rose-300 animate-spin" />
                          </motion.div>
                        ) : (
                          <motion.div
                            key={currentWish?.id || "empty"}
                            initial={{ opacity: 0, y: animation === "in" ? 20 : -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: animation === "out" ? -20 : 20 }}
                            transition={{ duration: 0.3 }}
                          >
                            {currentWish ? (
                              <>
                                <div className="bg-dark-200 p-4 rounded-lg mb-3 relative">
                                  <div className="absolute -top-2 -left-2 bg-rose-400 rounded-full p-1">
                                    <Heart size={12} className="text-white" />
                                  </div>
                                  <p className="text-light-100 italic">"{currentWish.message}"</p>
                                </div>
                                <div className="flex justify-between items-center text-sm text-light-300">
                                  <span>来自: {currentWish.name}</span>
                                  <span>{currentWish.date}</span>
                                </div>
                              </>
                            ) : (
                              <div className="text-center text-light-300 py-8">
                                还没有祝福，成为第一个留下祝福的人吧！
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <div className="flex justify-between">
                      <Button
                        onClick={getRandomWish}
                        className="bg-dark-500 hover:bg-dark-400 text-light-200"
                        disabled={isLoading || wishes.length === 0}
                      >
                        <RefreshCw size={16} className={`mr-2 ${isLoading ? "animate-spin" : ""}`} />
                        换一条
                      </Button>
                      <Button onClick={() => setIsWriting(true)} className="bg-rose-400 hover:bg-rose-500 text-white">
                        <Send size={16} className="mr-2" />
                        写祝福
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* 底部提示 */}
              <div className="bg-dark-400 px-4 py-2 text-center">
                <p className="text-light-400 text-xs">
                  已收集 <span className="text-rose-300">{wishes.length}</span> 条祝福
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
