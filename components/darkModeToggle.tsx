import { useTheme } from 'next-themes'

import Switch from './switch'
import { getNextTheme } from '../lib/util'

/**
 * Button to toggle dark/light mode.
 */
const DarkModeToggle = () => {
  const { theme, systemTheme, setTheme } = useTheme() // next-themes hook to enable dark mode
  const isDarkTheme = getNextTheme(theme, systemTheme) === 'light'
  /**
   * Performs the actual toggle
   */
  const handleThemeChange = () => {
    setTheme(getNextTheme(theme, systemTheme))
  }

  return <Switch onClick={handleThemeChange} checked={!isDarkTheme} />
}

export default DarkModeToggle
