"use client"

// components/simple-music-player.tsx

import { useState, useRef, useEffect } from "react"

// 确保这些URL是正确的，如果不是，请更新它们
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
  const audioRef = useRef<HTMLAudioElement>(null)

  const currentTrack = MUSIC_LIST[currentTrackIndex]

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch((error) => {
        console.error("Playback failed:", error)
        setIsPlaying(false) // Stop playing if there's an error
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
    <div style={{ padding: "20px", border: "1px solid #ccc", borderRadius: "5px", width: "300px" }}>
      <h3>{currentTrack.title}</h3>
      <audio ref={audioRef} src={currentTrack.src} onEnded={handleEnded} />
      <div style={{ marginTop: "10px" }}>
        <button onClick={handlePrev}>Previous</button>
        <button onClick={handlePlayPause}>{isPlaying ? "Pause" : "Play"}</button>
        <button onClick={handleNext}>Next</button>
      </div>
    </div>
  )
}

export default SimpleMusicPlayer
