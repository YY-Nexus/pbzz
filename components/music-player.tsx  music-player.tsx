"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Volume2, VolumeX, Play, Pause, Loader2 } from "lucide-react"

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [volume, setVolume] = useState(1)
  const [progress, setProgress] = useState(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Create audio element
    audioRef.current = new Audio("/music/wedding-song.mp3")
    audioRef.current.loop = true
    audioRef.current.volume = volume

    // Add loaded event listener
    const handleLoaded = () => setIsLoading(false)
    audioRef.current.addEventListener("canplaythrough", handleLoaded)

    // Handle audio errors
    const handleError = (e: ErrorEvent) => {
      console.error("Audio error:", e)
      setIsLoading(false)
    }
    audioRef.current.addEventListener("error", handleError)

    // Clean up
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("canplaythrough", handleLoaded)
        audioRef.current.removeEventListener("error", handleError)
        audioRef.current.pause()
        audioRef.current = null
      }

      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
    }
  }, [volume])

  // Set up progress tracking when playing
  useEffect(() => {
    if (isPlaying) {
      progressIntervalRef.current = setInterval(() => {
        if (audioRef.current) {
          setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100 || 0)
        }
      }, 1000)
    } else if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current)
    }

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
    }
  }, [isPlaying])

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play().catch((error) => {
          console.error("Error playing audio:", error)
        })
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number.parseFloat(e.target.value)
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 bg-black/50 backdrop-blur-sm p-4 rounded-md flex flex-col gap-2 max-w-[250px]">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={togglePlay}
          className="text-white hover:bg-white/20"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 size={20} className="animate-spin" />
          ) : isPlaying ? (
            <Pause size={20} />
          ) : (
            <Play size={20} />
          )}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleMute}
          className="text-white hover:bg-white/20"
          disabled={isLoading}
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </Button>
        <span className="text-white text-sm">婚礼背景音乐</span>
      </div>

      {/* Volume Control */}
      <div className="flex items-center gap-2">
        <Volume2 size={16} className="text-white" />
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={handleVolumeChange}
          className="w-full h-1.5 bg-white/30 rounded-lg appearance-none cursor-pointer"
          disabled={isLoading}
        />
      </div>

      {/* Progress Bar */}
      {!isLoading && (
        <div className="w-full bg-white/20 rounded-full h-1.5 overflow-hidden">
          <div className="bg-white h-full transition-all duration-300 ease-in-out" style={{ width: `${progress}%` }} />
        </div>
      )}
    </div>
  )
}

export default MusicPlayer
