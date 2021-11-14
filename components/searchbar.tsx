import { useRef, useState, BaseSyntheticEvent } from 'react'
import { useRouter } from 'next/router'
import web3 from 'web3'
import { toast } from 'react-hot-toast'

import { useKeyPress } from '../hooks/useKeyPress'
import { isENSDomain } from '../lib/util'

export default function Searchbar({ autoFocus = false }: { autoFocus?: boolean }) {
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  // Keep a reference to the searchbar input element
  const inputEl = useRef<HTMLInputElement>(null)

  const onEnterPress = () => {
    // Only run handler if focused on the searchbar
    if (document.activeElement === inputEl.current) {
      const dev = process.env.NODE_ENV !== 'production'
      const server = dev ? 'http://localhost:3000' : 'https://www.apemonitor.com'
      const href = `${server}/${searchQuery}`

      // Check if the given query is a valid ETH address or an ENS domain
      // If so, direct them to the profile
      if (web3.utils.isAddress(searchQuery) || isENSDomain(searchQuery)) {
        return router.push(href)
      } else {
        return toast.error(`${searchQuery} is not a valid Ethereum address.`)
      }
    }
  }

  useKeyPress('Enter', onEnterPress)

  useKeyPress('/', (e) => {
    inputEl.current && inputEl.current?.focus()
    e.preventDefault()
  })

  useKeyPress('Escape', (e) => {
    inputEl.current && inputEl.current?.blur()
    e.preventDefault()
  })

  return (
    <div className="mt-1 mx-auto relative rounded-md shadow-sm">
      <input
        ref={inputEl}
        autoFocus={autoFocus}
        onChange={(e: BaseSyntheticEvent) => {
          setSearchQuery(e.target.value)
        }}
        onInput={(e: BaseSyntheticEvent) => {
          setSearchQuery(e.target.value)
        }}
        type="text"
        className="text-black w-full focus:ring-yellow-600 focus:border-yellow-600 px-4 sm:text-sm border-gray-300 rounded-md
        dark:text-white dark:bg-gray-800 dark:border-gray-700"
        placeholder="[ / ] Enter an Ethereum address..."
      />
    </div>
  )
}
