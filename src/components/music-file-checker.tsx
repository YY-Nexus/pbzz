"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { FileAudio, CheckCircle, XCircle, AlertTriangle, RefreshCw, X, Info } from "lucide-react"

// 与音乐播放器中的列表保持一致
const musicList = [
  {
    title: "Electric Pulse",
    src: "/music/electric-pulse.mp3",
  },
  {
    title: "PBZZ.LOVE",
    src: "/music/pbzz-love.mp3",
  },
  {
    title: "一次就好",
    src: "/music/yi-ci-jiu-hao.mp3",
  },
  {
    title: "一生到老",
    src: "/music/yi-sheng-dao-lao.mp3",
  },
]

export function MusicFileChecker() {
  const [isOpen, setIsOpen] = useState(false)
  const [fileStatus, setFileStatus] = useState<Record<string, "loading" | "success" | "error">>({})
  const [fileDetails, setFileDetails] = useState<Record<string, { size?: string; type?: string; error?: string }>>({})
  const [isChecking, setIsChecking] = useState(false)

  const checkFiles = async () => {
    setIsChecking(true)
    setFileStatus({})
    setFileDetails({})

    for (const music of musicList) {
      setFileStatus((prev) => ({ ...prev, [music.src]: "loading" }))

      try {
        const response = await fetch(music.src)

        if (response.ok) {
          const contentType = response.headers.get("content-type") || "未知"
          const contentLength = response.headers.get("content-length")
          const size = contentLength ? `${(Number.parseInt(contentLength) / 1024).toFixed(2)} KB` : "未知"

          setFileStatus((prev) => ({ ...prev, [music.src]: "success" }))
          setFileDetails((prev) => ({
            ...prev,
            [music.src]: {
              size,
              type: contentType,
            },
          }))

          // 额外检查是否为有效的音频文件
          if (!contentType.includes("audio")) {
            setFileDetails((prev) => ({
              ...prev,
              [music.src]: {
                ...prev[music.src],
                error: "警告：文件类型不是音频",
              },
            }))
          }
        } else {
          setFileStatus((prev) => ({ ...prev, [music.src]: "error" }))
          setFileDetails((prev) => ({
            ...prev,
            [music.src]: {
              error: `HTTP错误: ${response.status} ${response.statusText}`,
            },
          }))
        }
      } catch (error) {
        setFileStatus((prev) => ({ ...prev, [music.src]: "error" }))
        setFileDetails((prev) => ({
          ...prev,
          [music.src]: {
            error: `网络错误: ${error instanceof Error ? error.message : "未知错误"}`,
          },
        }))
      }
    }

    setIsChecking(false)
  }

  useEffect(() => {
    if (isOpen) {
      checkFiles()
    }
  }, [isOpen])

  const getStatusIcon = (status: "loading" | "success" | "error") => {
    switch (status) {
      case "loading":
        return <RefreshCw className="animate-spin text-blue-400" size={16} />
      case "success":
        return <CheckCircle className="text-green-500" size={16} />
      case "error":
        return <XCircle className="text-red-500" size={16} />
    }
  }

  return (
    <>
      {/* 检查按钮 */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-24 left-6 z-50 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 shadow-lg"
        aria-label="检查音乐文件"
      >
        <FileAudio size={20} />
      </button>

      {/* 检查面板 */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-dark-300 rounded-lg shadow-xl max-w-md w-full overflow-hidden">
            <div className="bg-dark-400 px-4 py-3 flex justify-between items-center">
              <div className="flex items-center">
                <FileAudio className="text-blue-500 mr-2" size={18} />
                <h3 className="text-light-100 font-display text-lg">音乐文件检查</h3>
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
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-light-100 text-lg">音乐文件状态</h4>
                  <Button
                    onClick={checkFiles}
                    disabled={isChecking}
                    size="sm"
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    {isChecking ? (
                      <>
                        <RefreshCw className="animate-spin mr-2" size={14} />
                        检查中...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="mr-2" size={14} />
                        重新检查
                      </>
                    )}
                  </Button>
                </div>

                <ul className="space-y-4">
                  {musicList.map((music, index) => (
                    <li key={index} className="bg-dark-400 p-3 rounded">
                      <div className="flex justify-between items-center mb-2">
                        <div>
                          <p className="text-light-100 text-sm font-medium">{music.title}</p>
                          <p className="text-light-400 text-xs">{music.src}</p>
                        </div>
                        <div>{fileStatus[music.src] ? getStatusIcon(fileStatus[music.src]) : <span>-</span>}</div>
                      </div>

                      {fileStatus[music.src] === "success" && (
                        <div className="mt-2 border-t border-dark-500 pt-2">
                          <div className="flex items-start">
                            <Info className="text-blue-400 mr-1 mt-0.5" size={14} />
                            <div>
                              <p className="text-light-300 text-xs">
                                文件大小: {fileDetails[music.src]?.size || "未知"}
                              </p>
                              <p className="text-light-300 text-xs">
                                文件类型: {fileDetails[music.src]?.type || "未知"}
                              </p>
                              {fileDetails[music.src]?.error && (
                                <p className="text-amber-400 text-xs mt-1">{fileDetails[music.src].error}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {fileStatus[music.src] === "error" && (
                        <div className="mt-2 border-t border-dark-500 pt-2">
                          <div className="flex items-start">
                            <AlertTriangle className="text-red-500 mr-1 mt-0.5" size={14} />
                            <p className="text-red-400 text-xs">
                              {fileDetails[music.src]?.error || "文件不存在或无法访问"}
                            </p>
                          </div>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-dark-500 p-4 rounded mb-6">
                <h4 className="text-light-100 text-sm mb-2 flex items-center">
                  <AlertTriangle className="text-amber-500 mr-2" size={16} />
                  音频文件要求
                </h4>
                <ol className="text-light-300 text-xs space-y-2 list-decimal pl-5">
                  <li>
                    文件必须位于 <code className="bg-dark-600 px-1 py-0.5 rounded">/public/music/</code> 目录
                  </li>
                  <li>文件名必须与代码中的路径完全匹配（包括大小写和扩展名）</li>
                  <li>文件必须是有效的音频格式（MP3、WAV等）</li>
                  <li>文件大小不应过大（建议小于5MB）</li>
                </ol>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => setIsOpen(false)} className="bg-blue-500 hover:bg-blue-600 text-white">
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
