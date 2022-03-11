import React, { useState, useEffect } from 'react'

// Hook
export const useKeyPress = (targetKey: string, pressHandler: (e: React.KeyboardEvent) => void) => {
  // State for keeping track of whether key is pressed
  const [keyPressed, setKeyPressed] = useState(false)

  // If pressed key is our target key then set to true
  function downHandler(e: any) {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') e.preventDefault()
    if (e.key === targetKey) {
      setKeyPressed(true)
    }
  }

  const upHandler = (e: any) => {
    if (e.key === targetKey) {
      pressHandler(e)
      setKeyPressed(false)
    }
  }

  // Add event listeners
  useEffect(() => {
    window.addEventListener('keydown', downHandler)
    window.addEventListener('keyup', upHandler)
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener('keydown', downHandler)
      window.removeEventListener('keyup', upHandler)
    }
  }, [pressHandler]) // Empty array ensures that effect is only run on mount and unmount

  return keyPressed
}
