"use client"

import { useState, useRef, useEffect } from "react"

// 确保这些URL是正确的
const MUSIC_LIST = [
  {
    title: "Electric Pulse",
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ElectricPulse-r1bnLCldZqBEuhRS9EPUj92zCmk2Hq.mp3",
  },
  {
    title: "PBZZ.LOVE",
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/PBZZ.LOVE-0i4fjiYJ2yHXGIPC8EDIiu6487u7QO.mp3",
  },
  {
    title: "一次就好",
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/yicijiuhao-p623Is1yjkXtmVgj5NP1BhgxkRX30i.mp3",
  },
  {
    title: "一生到老",
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/yishengdaolao-b9ZsId2bfiVy1bDItGxcNm2hA0NiCP.mp3",
  },
]

const SimpleMusicPlayer = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [userInteracted, setUserInteracted] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  const currentTrack = MUSIC_LIST[currentTrackIndex]

  // 监听用户交互以启用自动播放
  useEffect(() => {
    const handleUserInteraction = () => {
      if (!userInteracted) {
        setUserInteracted(true)
        // 尝试自动播放
        if (audioRef.current) {
          audioRef.current
            .play()
            .then(() => {
              setIsPlaying(true)
              console.log("Auto-play started successfully")
            })
            .catch((error) => {
              console.error("Auto-play failed:", error)
            })
        }
      }
    }

    // 添加各种用户交互事件监听器
    document.addEventListener("click", handleUserInteraction)
    document.addEventListener("touchstart", handleUserInteraction)
    document.addEventListener("keydown", handleUserInteraction)

    return () => {
      document.removeEventListener("click", handleUserInteraction)
      document.removeEventListener("touchstart", handleUserInteraction)
      document.removeEventListener("keydown", handleUserInteraction)
    }
  }, [userInteracted])

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch((error) => {
        console.error("Playback failed:", error)
        setIsPlaying(false)
      })
    } else {
      audioRef.current?.pause()
    }
  }, [isPlaying, currentTrackIndex])

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleNext = () => {
    setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % MUSIC_LIST.length)
  }

  const handlePrev = () => {
    setCurrentTrackIndex((prevIndex) => (prevIndex - 1 + MUSIC_LIST.length) % MUSIC_LIST.length)
  }

  const handleEnded = () => {
    handleNext()
  }

  return (
    <div className="bg-black/30 backdrop-blur-md text-white p-4 rounded-lg shadow-lg">
      <h3 className="text-lg font-medium mb-2">{currentTrack.title}</h3>
      <audio ref={audioRef} src={currentTrack.src} onEnded={handleEnded} />

      <div className="flex space-x-2">
        <button onClick={handlePrev} className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition">
          ◀
        </button>
        <button
          onClick={handlePlayPause}
          className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition flex-grow"
        >
          {isPlaying ? "❚❚" : "▶"}
        </button>
        <button onClick={handleNext} className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition">
          ▶
        </button>
      </div>
    </div>
  )
}

export default SimpleMusicPlayer
