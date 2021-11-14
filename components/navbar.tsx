import { useState, useEffect } from 'react'
import classnames from 'classnames'
import { utils } from 'ethers'
import Link from 'next/link'
import { LogoutIcon } from '@heroicons/react/solid'
import { useRouter } from 'next/router'

import useWeb3Container from '../hooks/useWeb3User'
import AddressPill from './addressPill'
import Button from './button'
import ConnectModal from './connectWalletModal'
import Searchbar from '../components/searchbar'
import DarkModeToggle from './darkModeToggle'
import Emoji from './emoji'

interface IProps {
  displaySearchbar?: boolean
  displayConnectButton?: boolean
  customState?: {
    modalIsOpen: boolean
    setModalIsOpen: (open: boolean) => void
  }
}

/**
 * Navigation bar that enables connect/disconnect from Web3.
 */
const Navbar = ({ displaySearchbar = true, displayConnectButton = true, customState }: IProps) => {
  const { wallet, ensName } = useWeb3Container.useContainer()
  const { status, reset, networkName, account, balance } = wallet
  const [connectModalIsOpen, setConnectModalIsOpen] = useState(false)
  const router = useRouter()

  const { formatUnits } = utils

  const setModalIsOpen = (open: boolean) =>
    customState ? customState.setModalIsOpen(open) : setConnectModalIsOpen(open)
  const modalIsOpen = customState ? customState.modalIsOpen : connectModalIsOpen

  const handleLogout = () => reset()

  useEffect(() => {
    if (status === 'connected' && wallet.account) {
      const dev = process.env.NODE_ENV !== 'production'
      const server = dev ? 'http://localhost:3000' : 'https://www.apemonitor.com'
      const href = `${server}/${ensName ? ensName : wallet.account}`
      router.push(href)
    }
  }, [status])

  const formattedETH = parseFloat(formatUnits(balance)).toFixed(2)

  return (
    <>
      <nav className="w-full px-4 pt-8 md:py-8 items-center">
        <div className="flex justify-between">
          {/* Logo */}

          <Link href="/">
            <div className="ml-1">
              <Emoji className="text-4xl cursor-pointer" label="logo" symbol="🦧" />
            </div>
          </Link>

          <ConnectModal setIsOpen={setModalIsOpen} isOpen={modalIsOpen} />
          {displaySearchbar !== false && (
            <div className="hidden md:block w-96">
              <Searchbar />
            </div>
          )}

          {/* Connect to web3, dark mode toggle */}
          <div className="flex items-center space-x-2">
            {status === 'connected' ? (
              <div className="flex items-center space-x-2">
                <span
                  className={classnames(
                    'hidden md:inline-flex items-center px-3 py-0.5 rounded-full text-xs md:text-sm font-medium',
                    {
                      'bg-indigo-100 text-indigo-800': networkName == 'main',
                      'bg-yellow-100 text-yellow-800': networkName !== 'main',
                    },
                  )}
                >
                  <svg
                    className={classnames('-ml-1 mr-1.5 h-2 w-2', {
                      'text-indigo-400': networkName == 'main',
                      'text-yellow-400': networkName !== 'main',
                    })}
                  >
                    <svg
                      className={classnames('-ml-1 mr-1.5 h-2 w-2', {
                        'text-indigo-400': networkName == 'main',
                        'text-yellow-400': networkName !== 'main',
                      })}
                      fill="currentColor"
                      viewBox="0 0 8 8"
                    >
                      <circle cx={4} cy={4} r={3} />
                    </svg>
                  </svg>
                  {networkName == 'main' ? `Mainnet` : networkName}
                </span>
                <AddressPill address={account ? account : ''} ensName={ensName} balance={formattedETH} />
                <Button
                  type="button"
                  className="inline-flex items-center p-2 rounded-md shadow-sm bg-white text-black border border-solid border-gray-200 hover:bg-gray-100 
              dark:text-gray-100 dark:bg-gray-800 dark:border-gray-700"
                  onClick={handleLogout}
                >
                  <LogoutIcon className="h-4 w-4 fill-current" />
                </Button>
              </div>
            ) : (
              displayConnectButton !== false && <Button onClick={() => setModalIsOpen(true)}>Connect</Button>
            )}
            <DarkModeToggle />
          </div>
        </div>
        {displaySearchbar !== false && (
          <div className="block md:hidden w-full my-4">
            <Searchbar />
          </div>
        )}
      </nav>
    </>
  )
}

export default Navbar
