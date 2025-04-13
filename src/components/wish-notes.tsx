"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"

interface WishNote {
  id: number
  text: string
}

const WishNotes: React.FC = () => {
  const [wishNotes, setWishNotes] = useState<WishNote[]>([])

  const getRandomWish = useCallback(() => {
    const wishes = [
      "I wish for world peace.",
      "I wish for a million dollars.",
      "I wish to travel the world.",
      "I wish for good health.",
      "I wish to be happy.",
    ]
    const randomIndex = Math.floor(Math.random() * wishes.length)
    return { id: Date.now(), text: wishes[randomIndex] }
  }, [])

  useEffect(() => {
    const initialWish = getRandomWish()
    setWishNotes([initialWish])
  }, [getRandomWish])

  const addWish = () => {
    const newWish = getRandomWish()
    setWishNotes([...wishNotes, newWish])
  }

  return (
    <div>
      <h2>Wish Notes</h2>
      <button onClick={addWish}>Add a Wish</button>
      <ul>
        {wishNotes.map((wish) => (
          <li key={wish.id}>{wish.text}</li>
        ))}
      </ul>
    </div>
  )
}

export default WishNotes
