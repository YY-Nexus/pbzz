"use client"

import type React from "react"
import { useState } from "react"

type MusicCheckerProps = Record<string, never>

const MusicChecker: React.FC<MusicCheckerProps> = () => {
  const [musicUrl, setMusicUrl] = useState("")
  const [isValidUrl, setIsValidUrl] = useState<boolean | null>(null)

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMusicUrl(event.target.value)
    setIsValidUrl(null) // Reset validation status on input change
  }

  const validateUrl = () => {
    try {
      new URL(musicUrl)
      setIsValidUrl(true)
    } catch (error) {
      setIsValidUrl(false)
    }
  }

  return (
    <div>
      <h1>Music URL Checker</h1>
      <input type="text" placeholder="Enter music URL" value={musicUrl} onChange={handleInputChange} />
      <button onClick={validateUrl}>Check URL</button>

      {isValidUrl === true && <p style={{ color: "green" }}>Valid URL!</p>}
      {isValidUrl === false && <p style={{ color: "red" }}>Invalid URL!</p>}
    </div>
  )
}

export default MusicChecker
