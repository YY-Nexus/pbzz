"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Music, AlertCircle, CheckCircle, X } from "lucide-react"

// 音乐列表 - 与音乐播放器中的列表保持一致
const musicList = [
  {
    title: "浪漫婚礼曲",
    src: "/music/wedding-song-1.mp3",
  },
  {
    title: "甜蜜时光",
    src: "/music/wedding-song-2.mp3",
  },
  {
    title: "永恒誓言",
    src: "/music/wedding-song-3.mp3",
  },
]

export function MusicDebug() {
  const [isOpen, setIsOpen] = useState(false)
  const [fileStatus, setFileStatus] = useState<Record<string, "loading" | "success" | "error">>({})

  useEffect(() => {
    if (isOpen) {
      // 检查每个音乐文件是否可访问
      musicList.forEach((music) => {
        setFileStatus((prev) => ({ ...prev, [music.src]: "loading" }))

        fetch(music.src)
          .then((response) => {
            if (response.ok) {
              setFileStatus((prev) => ({ ...prev, [music.src]: "success" }))
            } else {
              setFileStatus((prev) => ({ ...prev, [music.src]: "error" }))
            }
          })
          .catch(() => {
            setFileStatus((prev) => ({ ...prev, [music.src]: "error" }))
          })
      })
    }
  }, [isOpen])

  const getStatusIcon = (status: "loading" | "success" | "error") => {
    switch (status) {
      case "loading":
        return <span className="animate-spin">⏳</span>
      case "success":
        return <CheckCircle className="text-green-500" size={16} />
      case "error":
        return <AlertCircle className="text-red-500" size={16} />
    }
  }

  return (
    <>
      {/* 调试按钮 - 只在开发环境显示 */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-24 right-6 z-50 bg-amber-500 hover:bg-amber-600 text-white rounded-full p-2 shadow-lg"
        aria-label="音乐调试"
      >
        <Music size={16} />
      </button>

      {/* 调试面板 */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-dark-300 rounded-lg shadow-xl max-w-md w-full overflow-hidden">
            <div className="bg-dark-400 px-4 py-3 flex justify-between items-center">
              <div className="flex items-center">
                <Music className="text-amber-500 mr-2" size={18} />
                <h3 className="text-light-100 font-display text-lg">音乐文件调试</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-light-300 hover:text-light-100"
                aria-label="关闭"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <h4 className="text-light-100 text-lg mb-4">音乐文件状态检查</h4>
                <ul className="space-y-3">
                  {musicList.map((music, index) => (
                    <li key={index} className="bg-dark-400 p-3 rounded flex justify-between items-center">
                      <div>
                        <p className="text-light-100 text-sm">{music.title}</p>
                        <p className="text-light-400 text-xs">{music.src}</p>
                      </div>
                      <div>{fileStatus[music.src] ? getStatusIcon(fileStatus[music.src]) : <span>-</span>}</div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-dark-500 p-4 rounded mb-6">
                <h4 className="text-light-100 text-sm mb-2">音乐文件路径说明：</h4>
                <p className="text-light-300 text-xs mb-2">
                  • 音乐文件应该放在 <code className="bg-dark-600 px-1 py-0.5 rounded">/public/music/</code> 目录下
                </p>
                <p className="text-light-300 text-xs">
                  • 文件路径应该是 <code className="bg-dark-600 px-1 py-0.5 rounded">/music/文件名.mp3</code>
                </p>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => setIsOpen(false)} className="bg-amber-500 hover:bg-amber-600 text-white">
                  关闭
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
