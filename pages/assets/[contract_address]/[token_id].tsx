import { useState, useEffect } from 'react'

import toast, { Toaster } from 'react-hot-toast'
import { useQuery } from '@apollo/client'
import { useRouter } from 'next/router'
import type { NextPage } from 'next'
import Head from 'next/head'

import { ICollection, ITokenData } from '../../../frontend/types'
import Navbar from '../../../components/layout/navbar'
import { GET_COLLECTION_BY_CONTRACT_ADDRESS } from '../../../graphql/queries'

import { getTokenURI, contractIsPunks } from '../../../lib/ethers/metadata'
import TokenDisplay from '../../../components/token/token'

const AssetPage: NextPage = () => {
  const router = useRouter()
  const { contract_address, token_id } = router.query
  const [tokenData, setTokenData] = useState<ITokenData | undefined>()

  const { data } = useQuery(GET_COLLECTION_BY_CONTRACT_ADDRESS, {
    variables: {
      contract_address,
    },
  })
  const collection: ICollection = data?.collections[0]

  useEffect(() => {
    if (typeof contract_address === 'string' && typeof token_id === 'string') {
      getTokenURI(contract_address, token_id)
        .then(setTokenData)
        .catch((e) => {
          toast.error(e.toString())
        })
    }
  }, [contract_address, token_id])

  const metadataTitle = tokenData?.metadata
    ? `${tokenData.metadata.name || token_id} - ${collection && collection.name}`
    : 'Ape Monitor'

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

      <TokenDisplay tokenData={tokenData} collection={collection} />
    </div>
  )
}

export default AssetPage
