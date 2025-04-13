"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Upload, Check, X, Music } from "lucide-react"

export function MusicUploader() {
  const [isOpen, setIsOpen] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    // 验证文件类型
    const validFiles: File[] = []
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      if (file.type.startsWith("audio/")) {
        validFiles.push(file)
      }
    }

    if (validFiles.length > 0) {
      setUploadedFiles(validFiles)
      setErrorMessage("")
    } else {
      setErrorMessage("请选择有效的音频文件（MP3、WAV等）")
    }
  }

  const handleUpload = async () => {
    if (uploadedFiles.length === 0) {
      setErrorMessage("请先选择音频文件")
      return
    }

    setUploadStatus("uploading")

    // 这里是模拟上传过程
    // 在实际应用中，您需要实现服务器端上传逻辑
    setTimeout(() => {
      // 模拟上传成功
      setUploadStatus("success")

      // 显示成功消息后重置状态
      setTimeout(() => {
        setUploadStatus("idle")
        setUploadedFiles([])
        setIsOpen(false)
      }, 2000)
    }, 2000)
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <>
      {/* 悬浮按钮 */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-50 bg-rose-400 hover:bg-rose-500 text-white rounded-full p-3 shadow-lg transition-transform duration-300 hover:scale-110"
        aria-label="上传音乐"
      >
        <Music size={24} />
      </button>

      {/* 上传弹窗 */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-dark-300 rounded-lg shadow-xl max-w-md w-full overflow-hidden">
            {/* 标题栏 */}
            <div className="bg-dark-400 px-4 py-3 flex justify-between items-center">
              <div className="flex items-center">
                <Music className="text-rose-300 mr-2" size={18} />
                <h3 className="text-light-100 font-display text-lg">上传婚礼音乐</h3>
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
            <div className="p-6">
              {uploadStatus === "success" ? (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500 mb-4">
                    <Check className="text-white" size={32} />
                  </div>
                  <h3 className="text-xl font-display text-light-100 mb-2">上传成功！</h3>
                  <p className="text-light-300">您的音乐文件已成功上传，将在播放器中显示。</p>
                </div>
              ) : (
                <>
                  <div
                    className="border-2 border-dashed border-dark-500 rounded-lg p-8 text-center mb-6 cursor-pointer hover:border-rose-300 transition-colors"
                    onClick={triggerFileInput}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="audio/*"
                      multiple
                      className="hidden"
                    />
                    <Upload className="mx-auto text-rose-300 mb-4" size={32} />
                    <h4 className="text-light-100 text-lg mb-2">点击选择音频文件</h4>
                    <p className="text-light-400 text-sm">支持MP3、WAV等格式</p>
                  </div>

                  {errorMessage && (
                    <div className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded mb-4">
                      {errorMessage}
                    </div>
                  )}

                  {uploadedFiles.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-light-100 text-sm mb-2">已选择的文件：</h4>
                      <ul className="space-y-2">
                        {uploadedFiles.map((file, index) => (
                          <li key={index} className="bg-dark-400 p-2 rounded flex justify-between items-center">
                            <span className="text-light-300 text-sm truncate">{file.name}</span>
                            <span className="text-light-400 text-xs">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex justify-end space-x-3">
                    <Button
                      variant="outline"
                      onClick={() => setIsOpen(false)}
                      className="border-light-300 text-light-300 hover:bg-dark-400"
                    >
                      取消
                    </Button>
                    <Button
                      onClick={handleUpload}
                      disabled={uploadedFiles.length === 0 || uploadStatus === "uploading"}
                      className="bg-rose-400 hover:bg-rose-500 text-white"
                    >
                      {uploadStatus === "uploading" ? (
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
                </>
              )}
            </div>

            {/* 底部提示 */}
            <div className="bg-dark-400 px-4 py-2 text-center">
              <p className="text-light-400 text-xs">
                上传的音乐将保存在 <span className="text-rose-300">/public/music/</span> 目录
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
