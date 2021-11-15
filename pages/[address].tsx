import { GetServerSideProps } from 'next'
import type { NextPage } from 'next'
import Head from 'next/head'
import { Toaster } from 'react-hot-toast'
import Davatar from '@davatar/react'

import Navbar from '../components/navbar'
import { middleEllipses, fixedNumber, getCostBasis, getNetworkAddress, isENSDomain } from '../lib/util'
import CollectionsTable from '../components/collectionsTable'

import ProfileBanner from '../components/profileBanner'

import DeltaDisplay from '../components/deltaDisplay'
import Tooltip from '../components/tooltip'
import useWeb3Container from '../hooks/useWeb3User'

const AddressPage: NextPage = ({
  collections,
  address,
  ensDomain,
  totalStats: { oneDayChange, value, assetsOwned, costBasis },
}: any) => {
  const { ethPrice } = useWeb3Container.useContainer()

  const metadataTitle = `${ensDomain ? ensDomain : middleEllipses(address, 4, 5, 2)}\'s NFT Portfolio`
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
      <div className="bg-black pb-28 border-b border-darkblue">
        <div className="max-w-screen-xl m-auto ">
          <Navbar />
        </div>
      </div>

      <div className="max-w-screen-lg m-auto bg-blackPearl">
        <div className="relative bottom-14">
          <ProfileBanner
            ensName={ensDomain ? ensDomain : middleEllipses(address, 4, 6, 4)}
            address={address}
            costBasis={fixedNumber(costBasis)}
            totalValue={fixedNumber(value)}
            oneDayChange={fixedNumber(oneDayChange)}
          />
        </div>
        <Toaster />

        {/* Display collections data */}
        <div className="flex flex-col flex-wrap space-y-2 -mt-7 mx-4">
          <CollectionsTable collections={collections} />
        </div>
      </div>
    </div>
  )
}

const error = () => {
  return { props: { collections: [], address: 'not found', totalStats: 0, ensDomain: 'not found' } }
}

const getOpenseaData = async (address: string) => {
  const dev = process.env.NODE_ENV !== 'production'
  const server = dev ? 'http://localhost:3000' : 'https://www.apemonitor.com'
  const resp = await fetch(`${server}/api/opensea/${address}`)
  return await resp.json()
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { params } = context
  const address = params?.address
  if (typeof address !== 'string') return error()
  const networkAddress = isENSDomain(address) ? await getNetworkAddress(address) : address
  if (!networkAddress) return error()
  const { collections } = await getOpenseaData(networkAddress)
  const ensDomain = isENSDomain(address) ? address : null

  const totalStats = collections.reduce(
    (acc: any, collection: any) => {
      const numOwned = collection.assets.length
      const { total: singleCostBasis } = getCostBasis(collection)
      const singleValue = collection.stats ? collection.assets.length * collection.stats.floor_price : 0
      const singleOneDayChange = collection.stats ? numOwned * collection.stats.one_day_change : 0
      return {
        assetsOwned: acc.assetsOwned + numOwned,
        value: acc.value + singleValue,
        oneDayChange: acc.oneDayChange + singleOneDayChange,
        costBasis: acc.costBasis + singleCostBasis,
      }
    },
    { value: 0, oneDayChange: 0, assetsOwned: 0, costBasis: 0 },
  )

  return { props: { collections, address: networkAddress, totalStats, ensDomain } }
}

export default AddressPage
