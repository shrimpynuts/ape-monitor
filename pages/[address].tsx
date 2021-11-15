import { useState, useEffect } from 'react'
import { GetServerSideProps } from 'next'
import type { NextPage } from 'next'
import Head from 'next/head'
import { Toaster } from 'react-hot-toast'

import Navbar from '../components/navbar'
import { middleEllipses, getOpenseaData, getNetworkAddress, isENSDomain } from '../lib/util'
import CollectionsTable from '../components/collectionsTable'
import ProfileDetails from '../components/profileDetails'

export interface ICollection {}

export interface ITotalStats {
  oneDayChange: number
  value: number
  assetsOwned: number
  costBasis: number
}

export interface IAddressData {
  address: string
  ensDomain?: string
}
interface IOpenseaDataState {
  collections: ICollection[]
  totalStats: ITotalStats
}

const AddressPage: NextPage<IAddressData> = (addressData) => {
  const [{ collections, totalStats }, setOpenseaData] = useState<IOpenseaDataState>({
    collections: [],
    totalStats: { oneDayChange: 0, value: 0, assetsOwned: 0, costBasis: 0 },
  })
  const { address, ensDomain } = addressData
  const [loading, setLoading] = useState(true)

  /**
   * Fetches data from opensea at the /api/opensea endpoint and updates state client-side
   */
  useEffect(() => {
    const initialFetch = async () => {
      setOpenseaData(await getOpenseaData(address))
      setLoading(false)
    }
    setLoading(true)
    initialFetch()
  }, [address])

  const metadataTitle = `${ensDomain ? ensDomain : middleEllipses(address, 4, 5, 2)}\'s NFT Portfolio`
  return (
    <div className="max-w-screen-xl m-auto pb-4 md:pb-12">
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
      <Toaster />
      <Navbar />

      {/* Display profile details */}
      <ProfileDetails loading={loading} totalStats={totalStats} addressData={addressData} />

      {/* Display collections data */}
      <div className="flex flex-col flex-wrap space-y-2 mt-4 mx-4">
        <CollectionsTable collections={collections} loading={loading} />
      </div>
    </div>
  )
}

/**
 * Error in case getServerSideProps cannot resolve ENS domain or bad address given
 */
const error = () => {
  return { props: { address: 'not found', ensDomain: 'not found' } }
}

/**
 * Resolves the ENS domain if given, and passes the domain and associated address to the page
 */
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { params } = context
  const address = params?.address
  if (typeof address !== 'string') return error()

  // Fetches the network address (starts with "0x") if given an ENS domain
  const networkAddress = isENSDomain(address) ? await getNetworkAddress(address) : address
  if (!networkAddress) return error()

  const ensDomain = isENSDomain(address) ? address : null

  return { props: { address: networkAddress, ensDomain } }
}

export default AddressPage
