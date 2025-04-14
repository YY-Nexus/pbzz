"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle, X, FileAudio, Check, Info } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function AudioDebug() {
  const [isOpen, setIsOpen] = useState(false)
  const [testResults, setTestResults] = useState<{
    canPlayMp3: boolean
    canPlayWav: boolean
    canPlayOgg: boolean
    audioContextWorks: boolean
    localFileWorks: boolean
    message: string
  } | null>(null)
  const [isTesting, setIsTesting] = useState(false)

  const runTests = async () => {
    setIsTesting(true)
    setTestResults(null)

    const results = {
      canPlayMp3: false,
      canPlayWav: false,
      canPlayOgg: false,
      audioContextWorks: false,
      localFileWorks: false,
      message: "",
    }

    try {
      // 测试音频格式支持
      const audio = new Audio()
      results.canPlayMp3 = audio.canPlayType("audio/mpeg") !== ""
      results.canPlayWav = audio.canPlayType("audio/wav") !== ""
      results.canPlayOgg = audio.canPlayType("audio/ogg") !== ""

      // 测试AudioContext
      try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext
        if (AudioContext) {
          const context = new AudioContext()
          results.audioContextWorks = context.state !== "closed"
          // 清理
          if (context.close) {
            context.close()
          }
        }
      } catch (err) {
        console.error("AudioContext测试失败:", err)
      }

      // 测试本地文件URL
      try {
        // 创建一个简单的音频数据
        const audioData = new Uint8Array([
          // 简单的WAV文件头
          0x52,
          0x49,
          0x46,
          0x46, // "RIFF"
          0x24,
          0x00,
          0x00,
          0x00, // 文件大小
          0x57,
          0x41,
          0x56,
          0x45, // "WAVE"
          0x66,
          0x6d,
          0x74,
          0x20, // "fmt "
          0x10,
          0x00,
          0x00,
          0x00, // 块大小
          0x01,
          0x00, // 格式类型
          0x01,
          0x00, // 通道数
          0x44,
          0xac,
          0x00,
          0x00, // 采样率
          0x88,
          0x58,
          0x01,
          0x00, // 字节率
          0x02,
          0x00, // 块对齐
          0x10,
          0x00, // 位深度
          0x64,
          0x61,
          0x74,
          0x61, // "data"
          0x00,
          0x00,
          0x00,
          0x00, // 数据大小
          // 简单的音频数据
          0x00,
          0x00,
          0x00,
          0x00,
        ])

        const blob = new Blob([audioData], { type: "audio/wav" })
        const url = URL.createObjectURL(blob)

        const testAudio = new Audio()
        testAudio.src = url

        // 设置超时，防止无限等待
        const timeout = new Promise((_, reject) => {
          setTimeout(() => reject(new Error("测试超时")), 3000)
        })

        // 等待加载或错误
        await Promise.race([
          new Promise<void>((resolve) => {
            testAudio.oncanplaythrough = () => {
              results.localFileWorks = true
              resolve()
            }
          }),
          new Promise<void>((resolve) => {
            testAudio.onerror = () => {
              results.localFileWorks = false
              resolve()
            }
          }),
          timeout,
        ])

        // 清理
        URL.revokeObjectURL(url)
      } catch (err) {
        console.error("本地文件URL测试失败:", err)
      }

      // 生成诊断消息
      if (results.canPlayMp3 && results.canPlayWav && results.audioContextWorks && results.localFileWorks) {
        results.message = "您的浏览器支持所有必要的音频功能。如果仍然无法播放音频，可能是文件格式问题或权限问题。"
      } else {
        results.message = "检测到以下问题:\n"
        if (!results.canPlayMp3) results.message += "- 不支持MP3格式\n"
        if (!results.canPlayWav) results.message += "- 不支持WAV格式\n"
        if (!results.canPlayOgg) results.message += "- 不支持OGG格式\n"
        if (!results.audioContextWorks) results.message += "- AudioContext不可用\n"
        if (!results.localFileWorks) results.message += "- 本地文件URL不可用\n"

        results.message += "\n建议尝试使用不同的浏览器或更新当前浏览器。"
      }
    } catch (err) {
      results.message = `测试过程中出错: ${err instanceof Error ? err.message : "未知错误"}`
    }

    setTestResults(results)
    setIsTesting(false)
  }

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed top-24 right-6 z-50 bg-amber-500 hover:bg-amber-600 text-white rounded-full p-2 shadow-lg h-10 w-10 flex items-center justify-center"
        aria-label="音频调试"
      >
        <FileAudio size={18} />
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
                  <FileAudio className="text-amber-500 mr-2" size={18} />
                  <h3 className="text-light-100 font-display text-lg">音频调试工具</h3>
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
                  <h4 className="text-light-100 text-lg mb-4 flex items-center">
                    <AlertCircle className="text-amber-400 mr-2" size={20} />
                    音频播放问题诊断
                  </h4>

                  <p className="text-light-300 text-sm mb-4">
                    此工具将检查您的浏览器是否支持必要的音频功能，并提供解决方案建议。
                  </p>

                  {testResults && (
                    <div className="bg-dark-400 p-4 rounded mb-4">
                      <h5 className="text-light-100 font-medium mb-2 flex items-center">
                        <Info className="text-blue-400 mr-2" size={16} />
                        测试结果
                      </h5>

                      <div className="grid grid-cols-2 gap-2 mb-3">
                        <div className="flex items-center">
                          <span className={testResults.canPlayMp3 ? "text-green-400" : "text-red-400"}>
                            {testResults.canPlayMp3 ? <Check size={16} /> : <X size={16} />}
                          </span>
                          <span className="text-light-300 text-sm ml-2">MP3支持</span>
                        </div>
                        <div className="flex items-center">
                          <span className={testResults.canPlayWav ? "text-green-400" : "text-red-400"}>
                            {testResults.canPlayWav ? <Check size={16} /> : <X size={16} />}
                          </span>
                          <span className="text-light-300 text-sm ml-2">WAV支持</span>
                        </div>
                        <div className="flex items-center">
                          <span className={testResults.canPlayOgg ? "text-green-400" : "text-red-400"}>
                            {testResults.canPlayOgg ? <Check size={16} /> : <X size={16} />}
                          </span>
                          <span className="text-light-300 text-sm ml-2">OGG支持</span>
                        </div>
                        <div className="flex items-center">
                          <span className={testResults.audioContextWorks ? "text-green-400" : "text-red-400"}>
                            {testResults.audioContextWorks ? <Check size={16} /> : <X size={16} />}
                          </span>
                          <span className="text-light-300 text-sm ml-2">AudioContext</span>
                        </div>
                        <div className="flex items-center">
                          <span className={testResults.localFileWorks ? "text-green-400" : "text-red-400"}>
                            {testResults.localFileWorks ? <Check size={16} /> : <X size={16} />}
                          </span>
                          <span className="text-light-300 text-sm ml-2">本地文件URL</span>
                        </div>
                      </div>

                      <div className="bg-dark-500 p-3 rounded text-light-300 text-xs whitespace-pre-line">
                        {testResults.message}
                      </div>
                    </div>
                  )}

                  <div className="bg-dark-500 p-4 rounded mb-4">
                    <h5 className="text-light-100 font-medium mb-2">音频问题解决方案:</h5>
                    <ol className="text-light-300 text-sm space-y-2 list-decimal pl-5">
                      <li>确保上传的音频文件格式是浏览器支持的 (MP3, WAV, OGG)</li>
                      <li>尝试使用较小的音频文件 (小于5MB)</li>
                      <li>尝试使用不同的浏览器 (Chrome, Firefox, Safari)</li>
                      <li>检查浏览器是否启用了音频权限</li>
                      <li>如果使用耳机或外接音箱，检查它们是否正常工作</li>
                    </ol>
                  </div>

                  <Button
                    onClick={runTests}
                    disabled={isTesting}
                    className="w-full bg-amber-500 hover:bg-amber-600 text-white"
                  >
                    {isTesting ? (
                      <>
                        <span className="animate-spin mr-2">⏳</span>
                        测试中...
                      </>
                    ) : (
                      "运行诊断测试"
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
