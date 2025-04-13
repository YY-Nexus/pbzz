"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { FileAudio, CheckCircle, XCircle, AlertTriangle, RefreshCw, X } from "lucide-react"

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

// 可能的文件名变体
const possibleVariants = [
  { suffix: "", description: "原始文件名" },
  { suffix: ".mp3", description: "添加.mp3扩展名" },
  { suffix: ".MP3", description: "大写扩展名" },
  { suffix: "-1.mp3", description: "添加数字后缀" },
  { suffix: "_1.mp3", description: "使用下划线" },
]

export function MusicChecker() {
  const [isOpen, setIsOpen] = useState(false)
  const [fileStatus, setFileStatus] = useState<Record<string, "loading" | "success" | "error">>({})
  const [variantStatus, setVariantStatus] = useState<Record<string, Record<string, "loading" | "success" | "error">>>(
    {},
  )
  const [isChecking, setIsChecking] = useState(false)

  const checkFiles = async () => {
    setIsChecking(true)
    setFileStatus({})
    setVariantStatus({})

    // 检查原始文件
    for (const music of musicList) {
      setFileStatus((prev) => ({ ...prev, [music.src]: "loading" }))
      try {
        const response = await fetch(music.src, { method: "HEAD" })
        setFileStatus((prev) => ({ ...prev, [music.src]: response.ok ? "success" : "error" }))

        // 如果原始文件不存在，检查可能的变体
        if (!response.ok) {
          const basePath = music.src.replace(/\.[^/.]+$/, "")
          setVariantStatus((prev) => ({ ...prev, [music.src]: {} }))

          for (const variant of possibleVariants) {
            const variantPath = `${basePath}${variant.suffix}`
            if (variantPath === music.src) continue // 跳过原始路径

            setVariantStatus((prev) => ({
              ...prev,
              [music.src]: { ...prev[music.src], [variantPath]: "loading" },
            }))

            try {
              const variantResponse = await fetch(variantPath, { method: "HEAD" })
              setVariantStatus((prev) => ({
                ...prev,
                [music.src]: {
                  ...prev[music.src],
                  [variantPath]: variantResponse.ok ? "success" : "error",
                },
              }))
            } catch (error) {
              setVariantStatus((prev) => ({
                ...prev,
                [music.src]: { ...prev[music.src], [variantPath]: "error" },
              }))
            }
          }
        }
      } catch (error) {
        setFileStatus((prev) => ({ ...prev, [music.src]: "error" }))
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

  const hasAnySuccessVariant = (src: string) => {
    if (!variantStatus[src]) return false
    return Object.values(variantStatus[src]).includes("success")
  }

  return (
    <>
      {/* 检查按钮 */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-24 left-6 z-50 bg-amber-500 hover:bg-amber-600 text-white rounded-full p-2 shadow-lg"
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
                <FileAudio className="text-amber-500 mr-2" size={18} />
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
                    className="bg-amber-500 hover:bg-amber-600 text-white"
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

                      {fileStatus[music.src] === "error" && (
                        <div className="mt-2 border-t border-dark-500 pt-2">
                          <div className="flex items-center mb-1">
                            {hasAnySuccessVariant(music.src) ? (
                              <AlertTriangle className="text-green-500 mr-1" size={14} />
                            ) : (
                              <AlertTriangle className="text-amber-500 mr-1" size={14} />
                            )}
                            <p className="text-light-300 text-xs">
                              {hasAnySuccessVariant(music.src)
                                ? "找到了可能的替代文件!"
                                : "未找到文件，请检查以下可能的文件名:"}
                            </p>
                          </div>

                          <ul className="space-y-1 mt-1">
                            {possibleVariants.map((variant, vIndex) => {
                              const basePath = music.src.replace(/\.[^/.]+$/, "")
                              const variantPath = `${basePath}${variant.suffix}`
                              if (variantPath === music.src) return null

                              const status = variantStatus[music.src]?.[variantPath]

                              return (
                                <li key={vIndex} className="flex justify-between items-center text-xs">
                                  <div className="flex items-center">
                                    {status === "success" && <CheckCircle className="text-green-500 mr-1" size={12} />}
                                    <span className={status === "success" ? "text-green-400" : "text-light-400"}>
                                      {variantPath} ({variant.description})
                                    </span>
                                  </div>
                                  {status && getStatusIcon(status)}
                                </li>
                              )
                            })}
                          </ul>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-dark-500 p-4 rounded mb-6">
                <h4 className="text-light-100 text-sm mb-2 flex items-center">
                  <AlertTriangle className="text-amber-500 mr-2" size={16} />
                  解决方案
                </h4>
                <ol className="text-light-300 text-xs space-y-2 list-decimal pl-5">
                  <li>
                    确保音乐文件已上传到 <code className="bg-dark-600 px-1 py-0.5 rounded">/public/music/</code> 目录
                  </li>
                  <li>检查文件名是否与代码中的路径完全匹配（包括大小写和扩展名）</li>
                  <li>如果发现了替代文件，请更新音乐播放器中的文件路径</li>
                  <li>如果所有文件都不存在，请重新上传音乐文件</li>
                </ol>
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
