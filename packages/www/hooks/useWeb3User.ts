import { useState, useEffect } from 'react'
import { createContainer } from 'unstated-next'
import { ethers } from 'ethers'

const Web3UserState = () => {
  const [ethPrice, setEthPrice] = useState<number>()

  // Fetch ether price
  useEffect(() => {
    async function fetchEtherPrice() {
      var etherscanProvider = new ethers.providers.EtherscanProvider()
      etherscanProvider
        .getEtherPrice()
        .then((price) => setEthPrice(price))
        .catch((err) => console.error(`Error while fetching eth price: ${err}`))
    }

    fetchEtherPrice()
  }, [])

  return {
    // Undefined wallet (removed use-wallet dependency)
    wallet: {
      status: undefined,
      networkName: undefined,
      account: undefined,
      balance: '0',
      connect: (arg: string) => new Promise<void>((resolve) => resolve()),
      reset: () => {},
      isConnected: () => false,
    },
    ensName: null,
    ethPrice,
  }
}

const web3UserContainer = createContainer(Web3UserState)

export default web3UserContainer
