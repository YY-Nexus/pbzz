"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Upload, X, Music, AlertCircle, LinkIcon, Search, Radio } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface MusicUploadProps {
  onMusicUpload: (music: { title: string; file: File | null; url?: string }) => void
}

export function MusicUpload({ onMusicUpload }: MusicUploadProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [title, setTitle] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 添加URL相关状态
  const [uploadMethod, setUploadMethod] = useState<"file" | "url" | "search">("file")
  const [musicUrl, setMusicUrl] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<
    Array<{ id: string; title: string; url: string; artist?: string; source?: string }>
  >([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchSource, setSearchSource] = useState<"qq" | "kugou">("qq")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const file = files[0]

    // 详细的文件类型检查
    const supportedTypes = [
      "audio/mpeg",
      "audio/mp3",
      "audio/wav",
      "audio/wave",
      "audio/x-wav",
      "audio/ogg",
      "audio/aac",
      "audio/m4a",
      "audio/x-m4a",
      "audio/mp4",
      "audio/webm",
      "audio/flac",
    ]

    // 检查MIME类型
    if (!supportedTypes.includes(file.type) && !file.name.match(/\.(mp3|wav|ogg|aac|m4a|flac)$/i)) {
      setError(`不支持的文件类型: ${file.type || "未知"}。请上传MP3、WAV或OGG格式的音频文件。`)
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

    // 记录文件信息用于调试
    console.log("已选择文件:", {
      name: file.name,
      type: file.type,
      size: `${(file.size / 1024).toFixed(2)} KB`,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (uploadMethod === "file") {
      if (!selectedFile) {
        setError("请选择音频文件")
        return
      }
    } else if (uploadMethod === "url") {
      if (!musicUrl.trim()) {
        setError("请输入音频URL")
        return
      }

      // 验证URL格式
      try {
        new URL(musicUrl)
      } catch (err) {
        setError("请输入有效的URL")
        return
      }

      // 简单验证URL是否指向音频文件
      const urlLower = musicUrl.toLowerCase()
      if (!urlLower.match(/\.(mp3|wav|ogg|aac|m4a|flac)($|\?)/i)) {
        setError("URL必须指向支持的音频文件 (MP3, WAV, OGG, AAC, M4A, FLAC)")
        return
      }
    }

    if (!title.trim()) {
      setError("请输入歌曲标题")
      return
    }

    setIsUploading(true)

    // 模拟上传过程
    setTimeout(() => {
      if (uploadMethod === "file") {
        onMusicUpload({ title, file: selectedFile })
      } else if (uploadMethod === "url") {
        onMusicUpload({ title, file: null, url: musicUrl })
      }

      setIsUploading(false)
      setIsOpen(false)
      setSelectedFile(null)
      setTitle("")
      setMusicUrl("")
    }, 1000)
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  // 搜索音乐功能
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError("请输入搜索关键词")
      return
    }

    setIsSearching(true)
    setError(null)
    setSearchResults([])

    try {
      // 模拟API请求延迟
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // 根据选择的音乐源生成不同的模拟结果
      if (searchSource === "qq") {
        // 模拟QQ音乐搜索结果
        const mockQQResults = [
          {
            id: `qq-${Date.now()}-1`,
            title: `${searchQuery} - 轻松版`,
            artist: "QQ推荐歌手",
            url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
            source: "QQ音乐",
          },
          {
            id: `qq-${Date.now()}-2`,
            title: `${searchQuery} (钢琴曲)`,
            artist: "钢琴家",
            url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
            source: "QQ音乐",
          },
          {
            id: `qq-${Date.now()}-3`,
            title: `${searchQuery} - 热门翻唱`,
            artist: "网络歌手",
            url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
            source: "QQ音乐",
          },
          {
            id: `qq-${Date.now()}-4`,
            title: `${searchQuery} (DJ版)`,
            artist: "DJ小明",
            url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
            source: "QQ音乐",
          },
        ]
        setSearchResults(mockQQResults)
      } else {
        // 模拟酷狗音乐搜索结果
        const mockKugouResults = [
          {
            id: `kugou-${Date.now()}-1`,
            title: `${searchQuery} - 原唱`,
            artist: "原唱歌手",
            url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
            source: "酷狗音乐",
          },
          {
            id: `kugou-${Date.now()}-2`,
            title: `${searchQuery} (Live版)`,
            artist: "现场演唱",
            url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
            source: "酷狗音乐",
          },
          {
            id: `kugou-${Date.now()}-3`,
            title: `${searchQuery} - 纯音乐`,
            artist: "纯音乐",
            url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
            source: "酷狗音乐",
          },
        ]
        setSearchResults(mockKugouResults)
      }
    } catch (err) {
      console.error("搜索失败:", err)
      setError("搜索失败，请重试")
    } finally {
      setIsSearching(false)
    }
  }

  // 选择搜索结果
  const selectSearchResult = (result: { id: string; title: string; url: string; artist?: string }) => {
    // 如果有艺术家信息，添加到标题中
    const fullTitle = result.artist ? `${result.title} - ${result.artist}` : result.title
    setTitle(fullTitle)
    setMusicUrl(result.url)
    setUploadMethod("url")
    // 不清空搜索结果，让用户可以选择其他歌曲
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
                  <h3 className="text-light-100 font-display text-lg">添加音乐</h3>
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
                {/* 上传方式选择 */}
                <div className="flex mb-6 bg-dark-400 rounded-lg p-1">
                  <button
                    onClick={() => {
                      setUploadMethod("file")
                      setError(null)
                    }}
                    className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
                      uploadMethod === "file" ? "bg-rose-400 text-white" : "text-light-300 hover:text-light-100"
                    }`}
                  >
                    <Upload size={16} className="inline-block mr-1" />
                    本地文件
                  </button>
                  <button
                    onClick={() => {
                      setUploadMethod("url")
                      setError(null)
                    }}
                    className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
                      uploadMethod === "url" ? "bg-rose-400 text-white" : "text-light-300 hover:text-light-100"
                    }`}
                  >
                    <LinkIcon size={16} className="inline-block mr-1" />
                    URL链接
                  </button>
                  <button
                    onClick={() => {
                      setUploadMethod("search")
                      setError(null)
                    }}
                    className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
                      uploadMethod === "search" ? "bg-rose-400 text-white" : "text-light-300 hover:text-light-100"
                    }`}
                  >
                    <Search size={16} className="inline-block mr-1" />
                    搜索
                  </button>
                </div>

                <form onSubmit={handleSubmit}>
                  {/* 本地文件上传 */}
                  {uploadMethod === "file" && (
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
                  )}

                  {/* URL输入 */}
                  {uploadMethod === "url" && (
                    <div className="mb-6">
                      <label htmlFor="musicUrl" className="block text-sm font-medium text-light-200 mb-1">
                        音频URL
                      </label>
                      <input
                        type="url"
                        id="musicUrl"
                        value={musicUrl}
                        onChange={(e) => setMusicUrl(e.target.value)}
                        className="w-full px-3 py-2 bg-dark-400 border border-dark-500 rounded-md text-light-100 focus:outline-none focus:ring-1 focus:ring-rose-300"
                        placeholder="https://example.com/music.mp3"
                      />
                      <p className="mt-1 text-light-400 text-xs">输入指向音频文件的直接链接 (MP3, WAV, OGG等)</p>
                    </div>
                  )}

                  {/* 搜索功能 */}
                  {uploadMethod === "search" && (
                    <div className="mb-6">
                      {/* 搜索源选择 */}
                      <div className="mb-4 flex items-center">
                        <span className="text-sm text-light-200 mr-3">搜索源:</span>
                        <div className="flex space-x-2">
                          <button
                            type="button"
                            onClick={() => setSearchSource("qq")}
                            className={`px-3 py-1 rounded-full text-xs ${
                              searchSource === "qq"
                                ? "bg-blue-500 text-white"
                                : "bg-dark-400 text-light-300 hover:bg-dark-500"
                            }`}
                          >
                            <Radio size={12} className="inline-block mr-1" />
                            QQ音乐
                          </button>
                          <button
                            type="button"
                            onClick={() => setSearchSource("kugou")}
                            className={`px-3 py-1 rounded-full text-xs ${
                              searchSource === "kugou"
                                ? "bg-teal-500 text-white"
                                : "bg-dark-400 text-light-300 hover:bg-dark-500"
                            }`}
                          >
                            <Radio size={12} className="inline-block mr-1" />
                            酷狗音乐
                          </button>
                        </div>
                      </div>

                      <div className="flex mb-4">
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="flex-1 px-3 py-2 bg-dark-400 border border-dark-500 rounded-l-md text-light-100 focus:outline-none focus:ring-1 focus:ring-rose-300"
                          placeholder="输入歌曲名或艺术家"
                        />
                        <button
                          type="button"
                          onClick={handleSearch}
                          disabled={isSearching || !searchQuery.trim()}
                          className={`px-4 py-2 text-white rounded-r-md disabled:opacity-50 disabled:cursor-not-allowed ${
                            searchSource === "qq" ? "bg-blue-500 hover:bg-blue-600" : "bg-teal-500 hover:bg-teal-600"
                          }`}
                        >
                          {isSearching ? <span className="animate-spin">⏳</span> : <Search size={18} />}
                        </button>
                      </div>

                      {/* 搜索结果 */}
                      {searchResults.length > 0 && (
                        <div className="bg-dark-400 rounded-md overflow-hidden mb-4">
                          <h5 className="text-light-100 text-sm font-medium p-2 border-b border-dark-500">
                            {searchSource === "qq" ? "QQ音乐搜索结果" : "酷狗音乐搜索结果"}
                          </h5>
                          <ul className="max-h-[200px] overflow-y-auto">
                            {searchResults.map((result) => (
                              <li key={result.id} className="border-b border-dark-500 last:border-b-0">
                                <button
                                  type="button"
                                  onClick={() => selectSearchResult(result)}
                                  className="w-full text-left p-2 hover:bg-dark-500 transition-colors"
                                >
                                  <div className="flex justify-between items-center">
                                    <div>
                                      <p className="text-light-100 text-sm truncate">{result.title}</p>
                                      {result.artist && (
                                        <p className="text-light-400 text-xs truncate">{result.artist}</p>
                                      )}
                                    </div>
                                    <span
                                      className={`text-xs px-1.5 py-0.5 rounded ${
                                        result.source === "QQ音乐"
                                          ? "bg-blue-500/20 text-blue-300"
                                          : "bg-teal-500/20 text-teal-300"
                                      }`}
                                    >
                                      {result.source}
                                    </span>
                                  </div>
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {isSearching && (
                        <div className="text-center py-4 text-light-300">
                          <span className="animate-spin inline-block mr-2">⏳</span>
                          正在搜索...
                        </div>
                      )}

                      {!isSearching && searchResults.length === 0 && searchQuery.trim() && (
                        <div className="text-center py-4 text-light-300">未找到结果，请尝试其他关键词</div>
                      )}
                    </div>
                  )}

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

                  {/* 提示信息 */}
                  {uploadMethod === "search" && (
                    <div className="mb-4 p-2 bg-dark-500/50 rounded text-xs text-light-400">
                      <p className="mb-1">⚠️ 注意：这是一个模拟功能，实际使用时需要：</p>
                      <ol className="list-decimal pl-4 space-y-1">
                        <li>申请相应平台的开发者账号和API密钥</li>
                        <li>遵循平台的API使用规则和限制</li>
                        <li>通常需要后端服务来处理API请求</li>
                      </ol>
                    </div>
                  )}

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
                      disabled={
                        isUploading ||
                        (uploadMethod === "file" && !selectedFile) ||
                        (uploadMethod === "url" && !musicUrl) ||
                        !title.trim()
                      }
                      className="bg-rose-400 hover:bg-rose-500 text-white"
                    >
                      {isUploading ? (
                        <>
                          <span className="animate-spin mr-2">⏳</span>
                          添加中...
                        </>
                      ) : (
                        <>
                          <Upload size={16} className="mr-2" />
                          添加音乐
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
