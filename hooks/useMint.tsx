import { useState } from 'react'
import { useContainer } from 'unstated-next'
import web3UserContainer from './useWeb3User'
import { toast } from 'react-hot-toast'
import { ExternalLinkIcon } from '@heroicons/react/solid'
import { ethers } from 'ethers'

const useMint = () => {
  const [loading, setLoading] = useState(false)
  let { provider, contract } = useContainer(web3UserContainer)

  // Pauses or unpauses the contract given the value
  // TODO:
  async function mint(numUnits: number) {
    setLoading(true)
    if (!provider || !contract) {
      console.log(`provider or contract is unavailable.`)
      return
    }
    // Collect contract with signer
    const signer = await provider.getSigner()
    const contractWithSigner = contract.connect(signer)
    const amountEth = ethers.utils.parseEther('0.01')

    console.log({ amountEth })

    try {
      // TODO: figure out what the mint function needs and pass it in
      const transaction = await contractWithSigner.mint(numUnits, { value: amountEth })
      const { hash } = transaction
      const transactionEtherscanUrl = `https://goerli.etherscan.io/tx/${hash}`

      // Toast based on whether the contract is successfully submitted
      await toast.promise(transaction.wait(), {
        loading: (
          <span className="flex items-center space-x-4">
            Transaction submitted{' '}
            <a className="ml-2 font-bold inline-block" target="_blank" rel="noreferrer" href={transactionEtherscanUrl}>
              <ExternalLinkIcon fill="#000000" className="h-4 w-4" />
            </a>
          </span>
        ),
        success: (
          <span className="flex items-center space-x-4">
            Transaction confirmed{' '}
            <a className="ml-2 font-bold inline-block" target="_blank" rel="noreferrer" href={transactionEtherscanUrl}>
              <ExternalLinkIcon fill="#000000" className="h-4 w-4" />
            </a>
          </span>
        ),
        error: 'Error submitting transaction',
      })

      const response = await transaction.wait()

      // wait() returns null if the transaction has not been mined
      if (response === null) toast.error('Transaction has not been mined')

      // Refetch the paused() state on the contract
      // await getPaused()
    } catch (e: any) {
      toast.error(`An error occurred:\n${e.message}`)
      console.log(e)
      setLoading(false)
    }
  }

  return { mint, data: { loading } }
}

export { useMint }
