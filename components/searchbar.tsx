import { useRef, useState, BaseSyntheticEvent } from 'react'
import { useRouter } from 'next/router'
import web3 from 'web3'
import { toast } from 'react-hot-toast'
import Reward, { RewardElement } from 'react-rewards'

import { useKeyPress } from '../hooks/useKeyPress'
import { isENSDomain } from '../lib/util'

export default function Searchbar({ autoFocus = false }: { autoFocus?: boolean }) {
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  // Keep a reference to the searchbar input element
  const inputEl = useRef<HTMLInputElement>(null)

  // Keep a reference to the reward element
  const rewardRef = useRef<RewardElement>(null)

  const onEnterPress = (checkFocused?: boolean) => {
    // Only run handler if focused on the searchbar unless checkFocused is false
    if (document.activeElement === inputEl.current || checkFocused === false) {
      const dev = process.env.NODE_ENV !== 'production'
      const server = dev ? 'http://localhost:3000' : 'https://www.apemonitor.com'
      const href = `${server}/${searchQuery}`

      // Check if the given query is a valid ETH address or an ENS domain
      // If so, direct them to the profile
      if (web3.utils.isAddress(searchQuery) || isENSDomain(searchQuery)) {
        rewardRef.current?.rewardMe()
        return router.push(href)
      } else {
        return toast.error(
          searchQuery ? 'Enter an Ethereum address or .eth domain' : `${searchQuery} is not a valid Ethereum address`,
        )
      }
    }
  }

  useKeyPress('Enter', () => onEnterPress())

  useKeyPress('/', (e) => {
    inputEl.current && inputEl.current?.focus()
    e.preventDefault()
  })

  useKeyPress('Escape', (e) => {
    inputEl.current && inputEl.current?.blur()
    e.preventDefault()
  })

  const handleFocus = (event: any) => event.target.select()

  return (
    <div className="relative mt-1 mx-auto rounded-md flex">
      <input
        ref={inputEl}
        autoFocus={autoFocus}
        onFocus={handleFocus}
        onChange={(e: BaseSyntheticEvent) => {
          setSearchQuery(e.target.value)
        }}
        onInput={(e: BaseSyntheticEvent) => {
          setSearchQuery(e.target.value)
        }}
        autoComplete="new-password"
        type="text"
        autoCapitalize="none"
        className="text-black z-10 w-full shadow-sm focus:ring-yellow-600 focus:border-yellow-600 px-4 sm:text-sm border-gray-300 rounded-md
        dark:text-white dark:bg-gray-800 dark:border-gray-700"
        placeholder="Enter an ENS name or Ethereum address"
      />
      <span className="absolute left-48 top-2">
        <Reward
          ref={rewardRef}
          type="emoji"
          config={{
            emoji: ['🍌'],
            elementCount: 10,
            spread: 360,
            startVelocity: 20,
            angle: 270,
            lifetime: 100,
          }}
        >
          <span />
        </Reward>
      </span>
      <button
        className="absolute right-2 z-20 top-2 p-1 bg-gray-100 shadow-sm w-6 sm:text-sm 
        border-gray-300 rounded-md dark:text-white dark:bg-gray-700 
        hover:bg-gray-200 dark:hover:bg-gray-800
        border dark:border-gray-700"
        onClick={() => onEnterPress(false)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="fill-current">
          <path d="M19,6a1,1,0,0,0-1,1v4a1,1,0,0,1-1,1H7.41l1.3-1.29A1,1,0,0,0,7.29,9.29l-3,3a1,1,0,0,0-.21.33,1,1,0,0,0,0,.76,1,1,0,0,0,.21.33l3,3a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42L7.41,14H17a3,3,0,0,0,3-3V7A1,1,0,0,0,19,6Z" />
        </svg>
      </button>
    </div>
  )
}
