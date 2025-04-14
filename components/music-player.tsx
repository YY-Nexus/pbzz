"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Music, Volume2, VolumeX, Play, Pause, SkipForward, SkipBack, List, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { MusicUpload } from "./music-upload"

// 默认音乐列表
const defaultMusicList = [
  {
    id: "default-1",
    title: "轻松旋律",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  },
  {
    id: "default-2",
    title: "温馨时刻",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  },
  {
    id: "default-3",
    title: "浪漫钢琴",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  },
]

interface MusicTrack {
  id: string
  title: string
  src: string
}

export function MusicPlayer() {
  // 基本状态
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const [isMinimized, setIsMinimized] = useState(true)
  const [showControls, setShowControls] = useState(false)
  const [volume, setVolume] = useState(0.5)
  const [showPlaylist, setShowPlaylist] = useState(false)
  const [musicList, setMusicList] = useState<MusicTrack[]>([])

  // 音频状态
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState("0:00")
  const [duration, setDuration] = useState("0:00")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 引用
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // 从本地存储加载音乐列表
  useEffect(() => {
    const loadMusicList = () => {
      try {
        const savedMusic = localStorage.getItem("musicList")
        if (savedMusic) {
          const parsedMusic = JSON.parse(savedMusic) as MusicTrack[]
          setMusicList(parsedMusic)
        } else {
          // 如果没有保存的音乐，使用默认列表
          setMusicList(defaultMusicList)
        }
      } catch (err) {
        console.error("加载音乐列表失败:", err)
        setMusicList(defaultMusicList)
      } finally {
        setLoading(false)
      }
    }

    loadMusicList()
  }, [])

  // 保存音乐列表到本地存储
  useEffect(() => {
    if (musicList.length > 0 && !loading) {
      localStorage.setItem("musicList", JSON.stringify(musicList))
    }
  }, [musicList, loading])

  // 初始化音频元素
  useEffect(() => {
    const audio = new Audio()
    audio.volume = volume
    audio.crossOrigin = "anonymous" // 允许跨域

    // 设置事件处理
    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    const handleEnded = () => playNext()
    const handleLoadedMetadata = () => {
      setDuration(formatTime(audio.duration))
      setLoading(false)
      setError(null)
    }
    const handleError = (e: Event) => {
      console.error("音频错误:", e)
      setError("加载音频失败")
      setIsPlaying(false)
      setLoading(false)
    }
    const handleCanPlay = () => {
      setLoading(false)
      setError(null)
    }

    audio.addEventListener("play", handlePlay)
    audio.addEventListener("pause", handlePause)
    audio.addEventListener("ended", handleEnded)
    audio.addEventListener("loadedmetadata", handleLoadedMetadata)
    audio.addEventListener("error", handleError)
    audio.addEventListener("canplay", handleCanPlay)

    audioRef.current = audio

    // 清理函数
    return () => {
      audio.pause()
      audio.src = ""
      audio.removeEventListener("play", handlePlay)
      audio.removeEventListener("pause", handlePause)
      audio.removeEventListener("ended", handleEnded)
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata)
      audio.removeEventListener("error", handleError)
      audio.removeEventListener("canplay", handleCanPlay)

      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
    }
  }, [])

  // 当音乐列表或当前曲目索引变化时加载音频
  useEffect(() => {
    if (!audioRef.current || loading || musicList.length === 0) return

    const loadAudio = async () => {
      try {
        setLoading(true)
        setError(null)

        // 重置状态
        setProgress(0)
        setCurrentTime("0:00")
        setDuration("0:00")

        const currentTrack = musicList[currentTrackIndex]
        if (!currentTrack) {
          setError("无效的音频")
          setLoading(false)
          return
        }

        // 更新音频源
        audioRef.current.pause()
        audioRef.current.src = currentTrack.src
        audioRef.current.load()

        // 如果之前在播放，则继续播放
        if (isPlaying) {
          try {
            await audioRef.current.play()
          } catch (err) {
            console.error("播放失败:", err)
            setError("播放失败，请点击播放按钮手动播放")
            setIsPlaying(false)
          }
        }
      } catch (err) {
        console.error("加载音频失败:", err)
        setError("加载音频失败")
        setLoading(false)
      }
    }

    loadAudio()
  }, [musicList, currentTrackIndex])

  // 更新进度
  useEffect(() => {
    if (!isPlaying || !audioRef.current) {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
        progressIntervalRef.current = null
      }
      return
    }

    progressIntervalRef.current = setInterval(() => {
      if (audioRef.current) {
        const currentProgress = (audioRef.current.currentTime / audioRef.current.duration) * 100 || 0
        setProgress(isNaN(currentProgress) ? 0 : currentProgress)
        setCurrentTime(formatTime(audioRef.current.currentTime))
      }
    }, 1000)

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
    }
  }, [isPlaying])

  // 当音量变化时更新
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  // 当静音状态变化时更新
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted
    }
  }, [isMuted])

  // 格式化时间
  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return "0:00"
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  // 播放/暂停切换
  const togglePlay = async () => {
    if (!audioRef.current || loading) return

    try {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        setError(null)
        await audioRef.current.play()
      }
    } catch (err) {
      console.error("播放控制失败:", err)
      setError("播放失败，请重试")
    }
  }

  // 播放下一首
  const playNext = () => {
    if (musicList.length <= 1) return
    setCurrentTrackIndex((prev) => (prev + 1) % musicList.length)
  }

  // 播放上一首
  const playPrevious = () => {
    if (musicList.length <= 1) return
    setCurrentTrackIndex((prev) => (prev - 1 + musicList.length) % musicList.length)
  }

  // 选择特定曲目播放
  const selectTrack = (index: number) => {
    setCurrentTrackIndex(index)
    setShowPlaylist(false)
  }

  // 切换静音状态
  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  // 切换最小化状态
  const toggleMinimize = () => {
    setIsMinimized(!isMinimized)
    setShowControls(false)
    setShowPlaylist(false)
  }

  // 切换播放列表显示
  const togglePlaylist = () => {
    setShowPlaylist(!showPlaylist)
  }

  // 设置音量
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number.parseFloat(e.target.value)
    setVolume(newVolume)
  }

  // 进度条点击处理
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || loading) return

    const progressBar = e.currentTarget
    const rect = progressBar.getBoundingClientRect()
    const clickPosition = (e.clientX - rect.left) / rect.width

    try {
      // 设置新的播放位置
      const newTime = clickPosition * audioRef.current.duration
      audioRef.current.currentTime = newTime

      // 更新UI
      setProgress(clickPosition * 100)
      setCurrentTime(formatTime(newTime))
    } catch (err) {
      console.error("设置进度时出错:", err)
      setError("设置进度失败")
    }
  }

  // 处理音乐上传
  const handleMusicUpload = ({ title, file }: { title: string; file: File }) => {
    // 创建文件的URL
    const fileUrl = URL.createObjectURL(file)

    // 添加到音乐列表
    const newTrack: MusicTrack = {
      id: `upload-${Date.now()}`,
      title,
      src: fileUrl,
    }

    setMusicList((prev) => [...prev, newTrack])

    // 自动切换到新上传的音乐
    setCurrentTrackIndex(musicList.length)
  }

  // 删除音乐
  const deleteTrack = (id: string) => {
    // 检查是否正在播放要删除的曲目
    const isCurrentTrack = musicList[currentTrackIndex].id === id

    // 从列表中移除
    setMusicList((prev) => prev.filter((track) => track.id !== id))

    // 如果删除的是当前播放的曲目，则停止播放或切换到下一首
    if (isCurrentTrack) {
      if (musicList.length <= 1) {
        // 如果这是最后一首歌，停止播放
        if (audioRef.current) {
          audioRef.current.pause()
          audioRef.current.src = ""
        }
        setIsPlaying(false)
      } else if (currentTrackIndex >= musicList.length - 1) {
        // 如果是最后一首，切换到第一首
        setCurrentTrackIndex(0)
      }
      // 否则保持当前索引，会自动切换到下一首
    } else if (currentTrackIndex > musicList.findIndex((track) => track.id === id)) {
      // 如果删除的曲目在当前曲目之前，需要调整索引
      setCurrentTrackIndex((prev) => prev - 1)
    }
  }

  // 如果没有音乐，显示提示
  if (!loading && musicList.length === 0) {
    return (
      <>
        <MusicUpload onMusicUpload={handleMusicUpload} />
        <div className="fixed bottom-6 right-6 z-40 bg-dark-800/80 backdrop-blur-md rounded-lg p-4 shadow-lg">
          <div className="flex items-center">
            <Music size={20} className="text-rose-300 mr-2" />
            <p className="text-light-100 text-sm">请上传音乐以开始播放</p>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <MusicUpload onMusicUpload={handleMusicUpload} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        style={{
          position: "fixed",
          right: "20px",
          bottom: isMinimized ? "80px" : "120px",
          zIndex: 40,
        }}
        className="music-player-container"
      >
        {/* 播放列表弹出框 */}
        <AnimatePresence>
          {showPlaylist && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-full mb-2 right-0 bg-dark-800/90 backdrop-blur-md rounded-lg shadow-lg p-2 w-64 max-h-[300px] overflow-y-auto"
            >
              <h4 className="text-light-100 text-xs font-medium mb-2 px-2 sticky top-0 bg-dark-800/90 py-1">
                歌曲列表 ({musicList.length})
              </h4>
              {musicList.length > 0 ? (
                <ul className="space-y-1">
                  {musicList.map((track, index) => (
                    <li key={track.id} className="group">
                      <div className="flex items-center">
                        <button
                          onClick={() => selectTrack(index)}
                          className={`flex-grow text-left px-2 py-1.5 rounded text-xs ${
                            currentTrackIndex === index
                              ? "bg-rose-400/20 text-rose-300"
                              : "text-light-300 hover:bg-dark-700/50"
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="truncate max-w-[180px]">
                              {index + 1}. {track.title}
                              {currentTrackIndex === index && isPlaying && (
                                <span className="ml-1 inline-block animate-pulse">▶</span>
                              )}
                            </span>
                          </div>
                        </button>
                        <button
                          onClick={() => deleteTrack(track.id)}
                          className="text-light-400 hover:text-red-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          aria-label="删除"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-light-400 text-xs text-center py-4">没有音乐，请上传</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div
          className={`bg-dark-800/80 backdrop-blur-md rounded-full shadow-lg transition-all duration-300 ${
            isMinimized ? "p-2" : "p-3"
          }`}
          onMouseEnter={() => setShowControls(true)}
          onMouseLeave={() => {
            if (!showPlaylist) {
              setShowControls(false)
            }
          }}
        >
          <div className="flex items-center">
            {/* 音乐图标 - 随音乐播放而跳动 */}
            <motion.div
              animate={
                isPlaying && !loading && !error
                  ? {
                      scale: [1, 1.2, 1],
                      rotate: [0, 5, -5, 0],
                    }
                  : { scale: 1, rotate: 0 }
              }
              transition={
                isPlaying && !loading && !error
                  ? {
                      duration: 1.5,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "loop",
                    }
                  : {}
              }
              onClick={toggleMinimize}
              className="cursor-pointer relative"
            >
              <Music
                size={isMinimized ? 20 : 24}
                className={error ? "text-red-400" : loading ? "text-amber-400" : "text-rose-300"}
              />
              {loading && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                >
                  <div className="w-full h-full rounded-full border-2 border-transparent border-t-amber-400"></div>
                </motion.div>
              )}
            </motion.div>

            {/* 控制按钮和标题 */}
            <AnimatePresence>
              {(!isMinimized || showControls) && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center ml-2 overflow-hidden"
                >
                  {/* 上一首按钮 */}
                  <button
                    onClick={playPrevious}
                    disabled={loading || musicList.length <= 1}
                    className="text-light-300 hover:text-rose-300 transition-colors p-1 mr-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="上一首"
                  >
                    <SkipBack size={16} />
                  </button>

                  {/* 播放/暂停按钮 */}
                  <button
                    onClick={togglePlay}
                    disabled={loading || musicList.length === 0}
                    className="text-light-300 hover:text-rose-300 transition-colors p-1 mr-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label={isPlaying ? "暂停" : "播放"}
                  >
                    {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                  </button>

                  {/* 下一首按钮 */}
                  <button
                    onClick={playNext}
                    disabled={loading || musicList.length <= 1}
                    className="text-light-300 hover:text-rose-300 transition-colors p-1 mr-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="下一首"
                  >
                    <SkipForward size={16} />
                  </button>

                  {/* 播放列表按钮 */}
                  <button
                    onClick={togglePlaylist}
                    className="text-light-300 hover:text-rose-300 transition-colors p-1 mr-2"
                    aria-label="播放列表"
                  >
                    <List size={16} />
                  </button>

                  {/* 音乐标题和状态 */}
                  <div className="mr-2">
                    <div className="text-light-100 text-xs whitespace-nowrap max-w-[80px] overflow-hidden text-ellipsis">
                      {loading ? "加载中..." : error ? "加载失败" : musicList[currentTrackIndex]?.title || "未知歌曲"}
                    </div>
                    {!isMinimized && (
                      <div className="text-light-400 text-xs flex justify-between">
                        <span>{currentTime}</span>
                        <span className="ml-1">{duration}</span>
                      </div>
                    )}
                    {!isMinimized && (
                      <div
                        className="w-full bg-dark-600 h-1 mt-1 rounded-full overflow-hidden cursor-pointer"
                        onClick={handleProgressClick}
                      >
                        <div
                          className={`h-full ${error ? "bg-red-400" : "bg-rose-400"}`}
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    )}
                  </div>

                  {/* 音量控制 */}
                  <div className="flex items-center">
                    <button
                      onClick={toggleMute}
                      className="text-light-300 hover:text-rose-300 transition-colors p-1"
                      aria-label={isMuted ? "取消静音" : "静音"}
                    >
                      {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                    </button>

                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={volume}
                      onChange={handleVolumeChange}
                      className="w-16 h-1 ml-1 bg-light-300 rounded-full appearance-none cursor-pointer"
                      aria-label="音量控制"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </>
  )
}
