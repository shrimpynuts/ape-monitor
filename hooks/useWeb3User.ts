import { useState, useEffect } from 'react'
import { createContainer } from 'unstated-next'
import { Web3Provider, JsonRpcProvider } from '@ethersproject/providers'

import { ethers } from 'ethers'
import { useWallet } from 'use-wallet'

import { CONTRACT_ADDRESS } from '../ethers/config'

const Web3UserState = () => {
  const wallet = useWallet()
  const { networkName, account, ethereum } = wallet

  const [ensName, setEnsName] = useState<null | string>(null) // If the user has an ENS name, it gets set here.
  const [provider, setProvider] = useState<Web3Provider | JsonRpcProvider | null>(null) // Ethers provider
  const [ethPrice, setEthPrice] = useState<number>()

  // Fetch ether price
  useEffect(() => {
    async function fetchEtherPrice() {
      var etherscanProvider = new ethers.providers.EtherscanProvider()
      const price = await etherscanProvider.getEtherPrice()
      console.log({ price })
      setEthPrice(price)
    }

    fetchEtherPrice()
  }, [])

  // Fetch other data
  useEffect(() => {
    if (account) {
      initializeData(account)
    }
    async function initializeData(address: string) {
      const provider = new ethers.providers.Web3Provider(ethereum)
      setProvider(provider)
      if (!CONTRACT_ADDRESS) return console.error('Could not find contract address')
      let ensName
      if (networkName === 'main') {
        ensName = await provider.lookupAddress(address)
        setEnsName(ensName)
      }
    }
  }, [account, ethereum, networkName])

  return { wallet, ensName, provider, ethPrice }
}

const web3UserContainer = createContainer(Web3UserState)

export default web3UserContainer
