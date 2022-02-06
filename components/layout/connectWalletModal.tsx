import Image from 'next/image'

import Modal from './modal'
import useWeb3Container from '../../hooks/useWeb3User'

interface IProps {
  isOpen: boolean
  setIsOpen: (value: boolean) => void
}

export default function connectModal({ isOpen, setIsOpen }: IProps) {
  const { wallet } = useWeb3Container.useContainer()

  const handleConnect = () => {
    wallet.connect('injected').then(() => {
      setIsOpen(false)
    })
  }

  const handleWalletConnect = () => {
    wallet.connect('walletconnect').then(() => {
      setIsOpen(false)
    })
  }

  const closeModal = () => {
    setIsOpen(false)
  }

  return (
    <Modal isOpen={isOpen} onClose={closeModal}>
      <div>
        <div className="flex flex-col">
          <div
            className="hover:bg-gray-100 border-b border-solid border-gray-200 transition-all duration-200 cursor-pointer flex flex-col justify-center p-6 py-8"
            onClick={handleConnect}
          >
            <Image src="/metamask.svg" width="50" height="50" alt="Metamask Logo" />
            <div className="text-center mt-1">
              <h2 className="text-2xl font-semibold dark:text-gray-900">MetaMask</h2>
              <p className="text-gray-500">Connect your metamask wallet.</p>
            </div>
          </div>
          <div
            className="hover:bg-gray-100 transition-all duration-200 cursor-pointer flex flex-col justify-center p-6 py-8"
            onClick={handleWalletConnect}
          >
            <Image src="/wallet-connect.svg" width="40" height="40" alt="Metamask Logo" />
            <div className="text-center mt-1">
              <h2 className="text-2xl font-semibold dark:text-gray-900">Wallet Connect</h2>
              <p className="text-gray-500">Scan with your favorite wallet to connect.</p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}
