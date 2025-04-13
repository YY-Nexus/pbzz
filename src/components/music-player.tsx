"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Music, Volume2, VolumeX, Play, Pause, SkipForward, List, AlertCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

// 使用多种格式和在线备用源
const musicList = [
  {
    title: "Wedding Song",
    src: "/music/wedding-song.mp3",
    fallbackSrc: "https://assets.mixkit.co/music/preview/mixkit-a-very-happy-christmas-897.mp3",
    duration: "3:45",
  },
]

// 确保可用的在线音乐
const onlineMusicList = [
  {
    title: "Happy Vibes",
    src: "https://assets.mixkit.co/music/preview/mixkit-a-very-happy-christmas-897.mp3",
    duration: "2:45",
  },
  {
    title: "Dreamy Beats",
    src: "https://assets.mixkit.co/music/preview/mixkit-dreaming-big-31.mp3",
    duration: "4:12",
  },
  {
    title: "Serene Melody",
    src: "https://assets.mixkit.co/music/preview/mixkit-serene-view-443.mp3",
    duration: "3:58",
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
  const [usingOnlineMusic, setUsingOnlineMusic] = useState(false)
  const [errorDetails, setErrorDetails] = useState("")
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // 获取当前活动的播放列表
  const activeList = usingOnlineMusic ? onlineMusicList : musicList

  // 创建和设置音频元素
  useEffect(() => {
    // 直接使用在线音乐列表，避免本地文件格式问题
    setUsingOnlineMusic(true)

    // 创建音频元素
    const audio = new Audio()
    audioRef.current = audio

    // 设置初始音量
    audio.volume = volume

    // 添加事件监听器
    audio.addEventListener("loadedmetadata", handleLoadedMetadata)
    audio.addEventListener("timeupdate", handleTimeUpdate)
    audio.addEventListener("ended", handleEnded)
    audio.addEventListener("play", handlePlay)
    audio.addEventListener("pause", handlePause)
    audio.addEventListener("error", handleError)
    audio.addEventListener("canplay", handleCanPlay)

    // 尝试加载第一首歌
    loadTrack(currentTrack)

    // 清理函数
    return () => {
      if (audio) {
        audio.pause()
        audio.src = ""
        audio.removeEventListener("loadedmetadata", handleLoadedMetadata)
        audio.removeEventListener("timeupdate", handleTimeUpdate)
        audio.removeEventListener("ended", handleEnded)
        audio.removeEventListener("play", handlePlay)
        audio.removeEventListener("pause", handlePause)
        audio.removeEventListener("error", handleError)
        audio.removeEventListener("canplay", handleCanPlay)
      }
    }
  }, [])

  // 加载音轨
  const loadTrack = (trackIndex: number) => {
    if (!audioRef.current) return

    const list = usingOnlineMusic ? onlineMusicList : musicList
    const track = list[trackIndex]

    // 重置状态
    setAudioLoaded(false)
    setAudioError(false)
    setProgress(0)
    setCurrentTime("0:00")
    setDuration(track.duration)
    setErrorDetails("")

    try {
      // 设置新的音频源
      audioRef.current.src = track.src
      audioRef.current.load()
      console.log(`尝试加载音频: ${track.src}`)
    } catch (err) {
      console.error("加载音频时出错:", err)
      handleLoadError(err)
    }
  }

  // 事件处理函数
  const handleLoadedMetadata = () => {
    if (!audioRef.current) return
    setAudioLoaded(true)
    setAudioError(false)
    setDuration(formatTime(audioRef.current.duration))
  }

  const handleTimeUpdate = () => {
    if (!audioRef.current || !audioRef.current.duration) return
    const audio = audioRef.current
    setProgress((audio.currentTime / audio.duration) * 100)
    setCurrentTime(formatTime(audio.currentTime))
  }

  const handleEnded = () => {
    playNext()
  }

  const handlePlay = () => {
    setIsPlaying(true)
  }

  const handlePause = () => {
    setIsPlaying(false)
  }

  const handleCanPlay = () => {
    setAudioLoaded(true)
    setAudioError(false)
  }

  const handleError = (e: Event) => {
    const error = (e.target as HTMLAudioElement).error
    let errorMsg = "未知错误"

    if (error) {
      switch (error.code) {
        case MediaError.MEDIA_ERR_ABORTED:
          errorMsg = "加载被中止"
          break
        case MediaError.MEDIA_ERR_NETWORK:
          errorMsg = "网络错误"
          break
        case MediaError.MEDIA_ERR_DECODE:
          errorMsg = "解码错误"
          break
        case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
          errorMsg = "音频格式不支持"
          break
        default:
          errorMsg = `错误代码: ${error.code}`
      }
    }

    console.error("音频加载错误:", errorMsg)
    setErrorDetails(errorMsg)
    handleLoadError(e)
  }

  const handleLoadError = (error: any) => {
    setAudioError(true)
    setIsPlaying(false)

    // 如果不是使用在线音乐，切换到在线音乐
    if (!usingOnlineMusic) {
      console.log("本地音频加载失败，切换到在线音乐")
      setUsingOnlineMusic(true)
      setCurrentTrack(0)
      setTimeout(() => {
        loadTrack(0)
      }, 500)
    }
  }

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
      const playPromise = audioRef.current.play()
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.error("播放失败:", error)
          handleLoadError(error)
        })
      }
    }
  }

  // 播放下一首
  const playNext = () => {
    const list = usingOnlineMusic ? onlineMusicList : musicList
    const nextTrack = (currentTrack + 1) % list.length
    setCurrentTrack(nextTrack)
  }

  // 选择特定曲目播放
  const selectTrack = (index: number) => {
    setCurrentTrack(index)
    setShowPlaylist(false)
  }

  // 当曲目改变时更新音频源
  useEffect(() => {
    loadTrack(currentTrack)

    // 如果之前在播放，则继续播放新曲目
    if (isPlaying && audioRef.current) {
      const playPromise = audioRef.current.play()
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.error("切换曲目后播放失败:", error)
          handleLoadError(error)
        })
      }
    }
  }, [currentTrack, usingOnlineMusic])

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
            className="absolute bottom-full mb-2 right-0 bg-black/80 backdrop-blur-md rounded-lg shadow-lg p-2 w-64"
          >
            <h4 className="text-white text-xs font-medium mb-2 px-2">歌曲列表</h4>
            <ul className="space-y-1">
              {activeList.map((track, index) => (
                <li key={index}>
                  <button
                    onClick={() => selectTrack(index)}
                    className={`w-full text-left px-2 py-1.5 rounded text-xs ${
                      currentTrack === index ? "bg-rose-400/20 text-rose-300" : "text-gray-300 hover:bg-gray-700/50"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span>
                        {index + 1}. {track.title}
                        {currentTrack === index && isPlaying && (
                          <span className="ml-1 inline-block animate-pulse">▶</span>
                        )}
                      </span>
                      <span className="text-gray-400">{track.duration}</span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 错误信息弹出框 */}
      <AnimatePresence>
        {audioError && errorDetails && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-full mb-2 right-0 bg-red-900/90 backdrop-blur-md rounded-lg shadow-lg p-3 w-64"
          >
            <div className="flex items-start">
              <AlertCircle className="text-red-300 mr-2 mt-0.5 flex-shrink-0" size={16} />
              <div>
                <h4 className="text-white text-xs font-medium mb-1">音频加载错误</h4>
                <p className="text-gray-300 text-xs">{errorDetails}</p>
                <p className="text-gray-300 text-xs mt-1">已切换到在线音乐</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className={`bg-black/80 backdrop-blur-md rounded-full shadow-lg transition-all duration-300 ${
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
            <Music
              size={isMinimized ? 20 : 24}
              className={audioError ? "text-red-400" : usingOnlineMusic ? "text-blue-400" : "text-rose-300"}
            />
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
                  className="text-gray-300 hover:text-rose-300 transition-colors p-1 mr-1"
                  aria-label={isPlaying ? "暂停" : "播放"}
                >
                  {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                </button>

                {/* 下一首按钮 */}
                <button
                  onClick={playNext}
                  className="text-gray-300 hover:text-rose-300 transition-colors p-1 mr-2"
                  aria-label="下一首"
                >
                  <SkipForward size={16} />
                </button>

                {/* 播放列表按钮 */}
                <button
                  onClick={togglePlaylist}
                  className="text-gray-300 hover:text-rose-300 transition-colors p-1 mr-2"
                  aria-label="播放列表"
                >
                  <List size={16} />
                </button>

                {/* 音乐标题和状态 */}
                <div className="mr-2">
                  <div className="text-white text-xs whitespace-nowrap max-w-[120px] overflow-hidden text-ellipsis">
                    {activeList[currentTrack].title}
                    {usingOnlineMusic && <span className="ml-1 text-blue-400 text-[10px]">(在线)</span>}
                  </div>
                  {!isMinimized && (
                    <div className="text-gray-400 text-xs flex justify-between">
                      <span>{currentTime}</span>
                      <span className="ml-1">{audioLoaded ? duration : activeList[currentTrack].duration}</span>
                    </div>
                  )}
                  {!isMinimized && (
                    <div
                      className="w-full bg-gray-600 h-1 mt-1 rounded-full overflow-hidden cursor-pointer"
                      onClick={handleProgressClick}
                    >
                      <div
                        className={`h-full ${
                          audioError ? "bg-red-400" : usingOnlineMusic ? "bg-blue-400" : "bg-rose-400"
                        }`}
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  )}
                </div>

                {/* 音量控制 */}
                <div className="flex items-center">
                  <button
                    onClick={toggleMute}
                    className="text-gray-300 hover:text-rose-300 transition-colors p-1"
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
                    className="w-16 h-1 ml-1 bg-gray-300 rounded-full appearance-none cursor-pointer"
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

export default MusicPlayer
