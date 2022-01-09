import { useState, useEffect } from 'react'

import { useQuery } from '@apollo/client'
import toast, { Toaster } from 'react-hot-toast'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'

import { ICollection } from '../../../frontend/types'
import Navbar from '../../../components/layout/navbar'
import { GET_COLLECTION_BY_CONTRACT_ADDRESS } from '../../../graphql/queries'

import { getTokenURI } from '../../../lib/ethers/metadata'

interface ITokenData {
  tokenURI: string
  owner: string
  metadata: { [key: string]: any }
  other: { [key: string]: any }
}

function DisplayKeyValue({ left, right }: { left: string; right: string }) {
  return (
    <div className="flex justify-between space-x-8">
      <span>{left}:</span>
      <span className="text-ellipsis line-clamp-3 hover:line-clamp-6">{right}</span>
    </div>
  )
}

const AssetPage: NextPage = () => {
  const router = useRouter()
  const { contract_address, token_id } = router.query
  const [tokenData, setTokenData] = useState<ITokenData | undefined>()

  const { loading, data } = useQuery(GET_COLLECTION_BY_CONTRACT_ADDRESS, {
    variables: {
      contract_address,
    },
  })
  const collection: ICollection = data?.collections[0]

  useEffect(() => {
    if (typeof contract_address === 'string' && typeof token_id === 'string') {
      getTokenURI(contract_address, token_id).then(setTokenData).catch(toast.error)
    }
  }, [contract_address, token_id])

  const metadataTitle = collection ? `${collection.name} - NFT Collection` : 'Ape Monitor'
  return (
    <div className="pb-4 md:pb-12">
      <Head>
        <title>{metadataTitle}</title>
        <meta name="description" content="NFT Monitor tracks NFT portfolios on the Ethereum network." />
        <link rel="icon" href="/favicon.ico" />

        {/* Open graph */}
        <meta property="og:url" content="https://www.apemonitor.com/" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={metadataTitle} />
        <meta property="og:description" content="Monitor the performance of your Ethereum NFTs using Opensea data." />
        <meta property="og:image" content="https://www.apemonitor.com/image-metadata.png" />

        {/* Twitter */}
        <meta property="twitter:url" content="https://www.apemonitor.com/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metadataTitle} />
        <meta name="twitter:description" content="Monitor the performance of your Ethereum NFTs using Opensea data." />
        <meta name="twitter:image" content="https://www.apemonitor.com/image-metadata.png" />
      </Head>
      <div className="bg-blue-500 dark:bg-black pb-16 md:pb-28 border-b light:border-gray-300 dark:border-darkblue">
        <div className="max-w-screen-xl m-auto ">
          <Navbar />
        </div>
      </div>

      {/* Toaster to give user feedback */}
      <Toaster
        toastOptions={{
          position: 'bottom-left',
        }}
      />

      {tokenData && typeof contract_address === 'string' && typeof token_id === 'string' && (
        <div
          className="mt-8 md:w-1/2 mx-4 md:mx-auto overflow-hidden space-y-4
        p-8 shadow sm:rounded-lg bg-gray-100 dark:bg-gray-850 text-gray-500 dark:text-gray-100
        md:flex-row md:items-center md:divide-y divide-gray-200 dark:divide-gray-700"
        >
          <DisplayKeyValue left="ERC 721 Contract" right={contract_address} />
          <DisplayKeyValue left="Token ID" right={token_id} />
          <DisplayKeyValue left="Token URI" right={tokenData.tokenURI} />
          <DisplayKeyValue left="Owner" right={tokenData.owner} />
          <div className="">
            {tokenData.metadata && (
              <div>
                {Object.entries(tokenData.metadata).map((entry, i) => {
                  const [key, value] = entry
                  return <DisplayKeyValue key={i} left={key} right={JSON.stringify(value)} />
                })}
              </div>
            )}
          </div>
          <div className="">
            {tokenData.other && (
              <div>
                {Object.entries(tokenData.other).map((entry, i) => {
                  const [key, value] = entry
                  return <DisplayKeyValue key={i} left={key} right={JSON.stringify(value)} />
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default AssetPage
