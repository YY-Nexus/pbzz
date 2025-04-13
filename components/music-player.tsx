"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Music, Volume2, VolumeX, Play, Pause, SkipForward, List } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

// 使用本地音频文件
const musicList = [
  {
    title: "Electric Pulse",
    src: "/music/electric-pulse.mp3",
    duration: "3:45",
  },
  {
    title: "PBZZ.LOVE",
    src: "/music/pbzz-love.mp3",
    duration: "4:20",
  },
  {
    title: "一次就好",
    src: "/music/yi-ci-jiu-hao.mp3",
    duration: "5:15",
  },
  {
    title: "一生到老",
    src: "/music/yi-sheng-dao-lao.mp3",
    duration: "4:35",
  },
]

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTrack, setCurrentTrack] = useState(0)
  const [isMinimized, setIsMinimized] = useState(false)
  const [showControls, setShowControls] = useState(false)
  const [volume, setVolume] = useState(0.7)
  const [showPlaylist, setShowPlaylist] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState("0:00")
  const [duration, setDuration] = useState("0:00")
  const [audioLoaded, setAudioLoaded] = useState(false)
  const [audioError, setAudioError] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // 初始化音频元素
  useEffect(() => {
    const audio = new Audio()

    // 设置音频事件监听器
    audio.addEventListener("loadedmetadata", () => {
      setAudioLoaded(true)
      setAudioError(false)
      setDuration(formatTime(audio.duration))
    })

    audio.addEventListener("timeupdate", () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100)
        setCurrentTime(formatTime(audio.currentTime))
      }
    })

    audio.addEventListener("ended", () => {
      playNextRandom()
    })

    audio.addEventListener("play", () => {
      setIsPlaying(true)
    })

    audio.addEventListener("pause", () => {
      setIsPlaying(false)
    })

    audio.addEventListener("error", (e) => {
      console.error("音频加载错误:", e)
      setAudioError(true)
      setIsPlaying(false)
    })

    // 设置初始音量
    audio.volume = volume

    // 尝试加载第一首歌
    audio.src = musicList[currentTrack].src

    // 保存引用
    audioRef.current = audio

    // 清理函数
    return () => {
      if (audio) {
        audio.pause()
        audio.src = ""

        // 移除所有事件监听器
        audio.removeEventListener("loadedmetadata", () => {})
        audio.removeEventListener("timeupdate", () => {})
        audio.removeEventListener("ended", () => {})
        audio.removeEventListener("play", () => {})
        audio.removeEventListener("pause", () => {})
        audio.removeEventListener("error", () => {})
      }

      // 清除进度更新定时器
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
    }
  }, [])

  // 格式化时间
  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return "0:00"
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  // 播放/暂停切换
  const togglePlay = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      // 如果之前有错误，尝试重新加载
      if (audioError) {
        audioRef.current.load()
        setAudioError(false)
      }

      const playPromise = audioRef.current.play()
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.error("播放失败:", error)
          setAudioError(true)
        })
      }
    }
  }

  // 播放下一首
  const playNext = () => {
    setCurrentTrack((prev) => (prev + 1) % musicList.length)
  }

  // 随机播放下一首
  const playNextRandom = () => {
    // 确保随机选择的不是当前曲目
    let nextIndex
    do {
      nextIndex = Math.floor(Math.random() * musicList.length)
    } while (nextIndex === currentTrack && musicList.length > 1)

    setCurrentTrack(nextIndex)
  }

  // 选择特定曲目播放
  const selectTrack = (index: number) => {
    setCurrentTrack(index)
    setShowPlaylist(false)
  }

  // 当曲目改变时更新音频源
  useEffect(() => {
    if (!audioRef.current) return

    // 重置状态
    setAudioLoaded(false)
    setAudioError(false)
    setProgress(0)
    setCurrentTime("0:00")

    // 更新音频源
    audioRef.current.src = musicList[currentTrack].src
    audioRef.current.load()

    // 如果之前在播放，则继续播放新曲目
    if (isPlaying) {
      const playPromise = audioRef.current.play()
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.error("切换曲目后播放失败:", error)
          setAudioError(true)
        })
      }
    }
  }, [currentTrack])

  // 设置音量
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  // 切换静音状态
  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
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
    if (audioRef.current) {
      audioRef.current.volume = newVolume
    }
  }

  // 进度条点击处理
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !audioLoaded) return

    const progressBar = e.currentTarget
    const rect = progressBar.getBoundingClientRect()
    const clickPosition = (e.clientX - rect.left) / rect.width

    // 设置新的播放位置
    const newTime = clickPosition * audioRef.current.duration
    audioRef.current.currentTime = newTime

    // 更新UI
    setProgress(clickPosition * 100)
    setCurrentTime(formatTime(newTime))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 1 }}
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
            className="absolute bottom-full mb-2 right-0 bg-dark-800/90 backdrop-blur-md rounded-lg shadow-lg p-2 w-64"
          >
            <h4 className="text-light-100 text-xs font-medium mb-2 px-2">歌曲列表</h4>
            <ul className="space-y-1">
              {musicList.map((track, index) => (
                <li key={index}>
                  <button
                    onClick={() => selectTrack(index)}
                    className={`w-full text-left px-2 py-1.5 rounded text-xs ${
                      currentTrack === index ? "bg-rose-400/20 text-rose-300" : "text-light-300 hover:bg-dark-700/50"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span>
                        {index + 1}. {track.title}
                        {currentTrack === index && isPlaying && (
                          <span className="ml-1 inline-block animate-pulse">▶</span>
                        )}
                      </span>
                      <span className="text-light-400">{track.duration}</span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
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
              isPlaying
                ? {
                    scale: [1, 1.2, 1],
                    rotate: [0, 5, -5, 0],
                  }
                : { scale: 1, rotate: 0 }
            }
            transition={
              isPlaying
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
            <Music size={isMinimized ? 20 : 24} className={audioError ? "text-red-400" : "text-rose-300"} />
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
                {/* 播放/暂停按钮 */}
                <button
                  onClick={togglePlay}
                  className="text-light-300 hover:text-rose-300 transition-colors p-1 mr-1"
                  aria-label={isPlaying ? "暂停" : "播放"}
                >
                  {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                </button>

                {/* 下一首按钮 */}
                <button
                  onClick={playNext}
                  className="text-light-300 hover:text-rose-300 transition-colors p-1 mr-2"
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
                    {audioError ? "加载失败" : musicList[currentTrack].title}
                  </div>
                  {!isMinimized && (
                    <div className="text-light-400 text-xs flex justify-between">
                      <span>{currentTime}</span>
                      <span className="ml-1">{audioLoaded ? duration : musicList[currentTrack].duration}</span>
                    </div>
                  )}
                  {!isMinimized && (
                    <div
                      className="w-full bg-dark-600 h-1 mt-1 rounded-full overflow-hidden cursor-pointer"
                      onClick={handleProgressClick}
                    >
                      <div
                        className={`h-full ${audioError ? "bg-red-400" : "bg-rose-400"}`}
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
  )
}
