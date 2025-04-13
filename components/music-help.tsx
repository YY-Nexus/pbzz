"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { HelpCircle, X, Music, FileUp, Check, AlertTriangle } from "lucide-react"

export function MusicHelp() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* 帮助按钮 */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-50 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-3 shadow-lg transition-transform duration-300 hover:scale-110"
        aria-label="音乐帮助"
      >
        <HelpCircle size={24} />
      </button>

      {/* 帮助弹窗 */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-dark-300 rounded-lg shadow-xl max-w-md w-full overflow-hidden">
            <div className="bg-dark-400 px-4 py-3 flex justify-between items-center">
              <div className="flex items-center">
                <Music className="text-blue-400 mr-2" size={18} />
                <h3 className="text-light-100 font-display text-lg">音乐播放帮助</h3>
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
                  <AlertTriangle className="text-amber-400 mr-2" size={20} />
                  音乐加载失败问题解决
                </h4>

                <div className="space-y-4">
                  <div className="bg-dark-400 p-4 rounded">
                    <h5 className="text-light-100 font-medium mb-2 flex items-center">
                      <Check className="text-green-400 mr-2" size={16} />
                      已添加自动回退功能
                    </h5>
                    <p className="text-light-300 text-sm">
                      如果本地音乐文件加载失败，播放器会自动切换到在线音乐源。您会看到标题前显示"在线音乐:"。
                    </p>
                  </div>

                  <div className="bg-dark-400 p-4 rounded">
                    <h5 className="text-light-100 font-medium mb-2">正确上传音乐文件的步骤：</h5>
                    <ol className="text-light-300 text-sm space-y-2 list-decimal pl-5">
                      <li>确保音乐文件为MP3格式</li>
                      <li>
                        将文件上传到 <code className="bg-dark-600 px-1 py-0.5 rounded">/public/music/</code> 目录
                      </li>
                      <li>文件名应简单，避免特殊字符和空格</li>
                      <li>在音乐播放器组件中更新文件路径</li>
                    </ol>
                  </div>

                  <div className="bg-dark-400 p-4 rounded">
                    <h5 className="text-light-100 font-medium mb-2 flex items-center">
                      <FileUp className="text-blue-400 mr-2" size={16} />
                      音乐文件路径示例
                    </h5>
                    <p className="text-light-300 text-sm mb-2">
                      如果您上传了名为 "wedding.mp3" 的文件到 public/music 目录，正确的路径应该是：
                    </p>
                    <code className="bg-dark-600 px-2 py-1 rounded block text-light-200 text-sm">
                      /music/wedding.mp3
                    </code>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => setIsOpen(false)} className="bg-blue-500 hover:bg-blue-600 text-white">
                  明白了
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
