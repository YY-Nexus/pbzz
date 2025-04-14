"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Upload, X, Music, AlertCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface MusicUploadProps {
  onMusicUpload: (music: { title: string; file: File }) => void
}

export function MusicUpload({ onMusicUpload }: MusicUploadProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [title, setTitle] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const file = files[0]

    // 验证文件类型
    if (!file.type.startsWith("audio/")) {
      setError("请选择有效的音频文件（MP3、WAV等）")
      return
    }

    // 验证文件大小 (限制为10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError("文件大小不能超过10MB")
      return
    }

    setSelectedFile(file)
    // 从文件名中提取标题（去掉扩展名）
    const fileName = file.name.replace(/\.[^/.]+$/, "")
    setTitle(fileName)
    setError(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedFile) {
      setError("请选择音频文件")
      return
    }

    if (!title.trim()) {
      setError("请输入歌曲标题")
      return
    }

    setIsUploading(true)

    // 模拟上传过程
    setTimeout(() => {
      onMusicUpload({ title, file: selectedFile })
      setIsUploading(false)
      setIsOpen(false)
      setSelectedFile(null)
      setTitle("")
    }, 1000)
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 left-6 z-40 bg-rose-400 hover:bg-rose-500 text-white rounded-full p-3 shadow-lg h-12 w-12 flex items-center justify-center"
        aria-label="上传音乐"
      >
        <Upload size={20} />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-dark-300 rounded-lg shadow-xl max-w-md w-full overflow-hidden"
            >
              <div className="bg-dark-400 px-4 py-3 flex justify-between items-center">
                <div className="flex items-center">
                  <Music className="text-rose-300 mr-2" size={18} />
                  <h3 className="text-light-100 font-display text-lg">上传音乐</h3>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-light-300 hover:text-light-100"
                  aria-label="关闭"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6">
                <div
                  className="border-2 border-dashed border-dark-500 rounded-lg p-8 text-center mb-6 cursor-pointer hover:border-rose-300 transition-colors"
                  onClick={triggerFileInput}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="audio/*"
                    className="hidden"
                  />
                  <Upload className="mx-auto text-rose-300 mb-4" size={32} />
                  <h4 className="text-light-100 text-lg mb-2">
                    {selectedFile ? selectedFile.name : "点击选择音频文件"}
                  </h4>
                  <p className="text-light-400 text-sm">支持MP3、WAV等格式，最大10MB</p>
                </div>

                {error && (
                  <div className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded mb-4 flex items-start">
                    <AlertCircle size={16} className="mr-2 mt-0.5 flex-shrink-0" />
                    <p className="text-sm">{error}</p>
                  </div>
                )}

                <div className="mb-4">
                  <label htmlFor="title" className="block text-sm font-medium text-light-200 mb-1">
                    歌曲标题
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-dark-400 border border-dark-500 rounded-md text-light-100 focus:outline-none focus:ring-1 focus:ring-rose-300"
                    placeholder="输入歌曲标题"
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsOpen(false)}
                    className="border-light-300 text-light-300 hover:bg-dark-400"
                  >
                    取消
                  </Button>
                  <Button
                    type="submit"
                    disabled={isUploading || !selectedFile}
                    className="bg-rose-400 hover:bg-rose-500 text-white"
                  >
                    {isUploading ? (
                      <>
                        <span className="animate-spin mr-2">⏳</span>
                        上传中...
                      </>
                    ) : (
                      <>
                        <Upload size={16} className="mr-2" />
                        上传音乐
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
