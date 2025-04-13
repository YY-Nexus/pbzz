"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"

interface MusicPlayerProps {
  audioSrc: string
  title: string
  artist: string
  coverArt: string
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ audioSrc, title, artist, coverArt }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.5)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const audio = audioRef.current

    if (audio) {
      const handleLoadedMetadata = () => {
        setDuration(audio.duration)
      }

      const handleTimeUpdate = () => {
        setCurrentTime(audio.currentTime)
      }

      audio.addEventListener("loadedmetadata", handleLoadedMetadata)
      audio.addEventListener("timeupdate", handleTimeUpdate)

      return () => {
        audio.removeEventListener("loadedmetadata", handleLoadedMetadata)
        audio.removeEventListener("timeupdate", handleTimeUpdate)
      }
    }
  }, [audioSrc])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = Number.parseFloat(event.target.value)
    if (audioRef.current) {
      audioRef.current.currentTime = newTime
      setCurrentTime(newTime)
    }
  }

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number.parseFloat(event.target.value)
    setVolume(newVolume)
  }

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
  }

  return (
    <div className="music-player">
      <div className="cover-art">
        <img src={coverArt || "/placeholder.svg"} alt="Cover Art" />
      </div>
      <div className="song-info">
        <h3>{title}</h3>
        <p>{artist}</p>
      </div>
      <div className="controls">
        <button onClick={togglePlay}>{isPlaying ? "Pause" : "Play"}</button>
        <input type="range" min="0" max={duration} value={currentTime} onChange={handleTimeChange} />
        <p>
          {formatTime(currentTime)} / {formatTime(duration)}
        </p>
        <input type="range" min="0" max="1" step="0.01" value={volume} onChange={handleVolumeChange} />
      </div>
      <audio ref={audioRef} src={audioSrc} preload="metadata" />
    </div>
  )
}

export default MusicPlayer
