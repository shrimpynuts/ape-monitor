import { useEffect } from 'react'
import { GetServerSideProps } from 'next'
import type { NextPage } from 'next'
import Head from 'next/head'
import { Toaster } from 'react-hot-toast'
import Davatar from '@davatar/react'

import Navbar from '../components/navbar'
import { middleEllipses, fixedNumber, getCostBasis } from '../lib/util'
import CollectionsTable from '../components/collectionsTable'
import DeltaDisplay from '../components/deltaDisplay'
import Tooltip from '../components/tooltip'

import useWeb3Container from '../hooks/useWeb3User'

const AddressPage: NextPage = ({
  collections,
  address,
  totalStats: { oneDayChange, value, assetsOwned, costBasis },
}: any) => {
  const { ethPrice } = useWeb3Container.useContainer()

  return (
    <div className="max-w-screen-xl m-auto pb-4 md:pb-12">
      <Head>
        <title>{middleEllipses(address, 4, 5, 2)}&apos;s NFT Portfolio</title>
        <meta name="description" content="NFT Monitor tracks NFT portfolios on the Ethereum network." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Toaster />
      <Navbar />

      {/* Display profile details */}
      <div className="flex w-full flex-col px-6 py-4 space-y-4 mx-4 shadow sm:rounded-lg bg-gray-100 dark:bg-gray-850 text-gray-500 dark:text-gray-100">
        <div className="flex flex-col md:flex-row md:items-center md:divide-x divide-gray-200 dark:divide-gray-700">
          <div className="flex text-lg px-4 space-x-2 items-center">
            <Davatar
              size={20}
              address={address}
              generatedAvatarType="jazzicon" // optional, 'jazzicon' or 'blockies'
            />
            <h4 className="text-lg ">{middleEllipses(address, 4, 6, 4)}</h4>
          </div>
          <h4 className="text-lg px-4 "># of NFTs: {assetsOwned}</h4>
          <h4 className="text-lg px-4 relative flex space-x-2 items-center ">
            <Tooltip text="Based on floor prices, discounting rarity" />
            <div className="flex space-x-2 items-center">
              Total Value: {fixedNumber(value)}Ξ &nbsp; {ethPrice && <div>(${fixedNumber(ethPrice * value, 0)}) </div>}
              <DeltaDisplay delta={oneDayChange} denomination="%" />
            </div>
          </h4>
          <h4 className="text-lg px-4 relative flex space-x-2 items-center ">
            <Tooltip text="May not be accurate due to mint costs" />
            <div className="flex space-x-2 items-center">
              Total Cost Basis: {fixedNumber(costBasis)}Ξ &nbsp;{' '}
              {ethPrice && <div>(${fixedNumber(costBasis * ethPrice, 0)}) </div>}
            </div>
          </h4>
          {ethPrice && <h4 className="text-lg px-4 ">ETH Price: ${ethPrice}</h4>}
        </div>
      </div>

      {/* Display collections data */}
      <div className="flex flex-col flex-wrap space-y-2 mt-4 mx-4">
        <CollectionsTable collections={collections} />
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { params } = context

  const dev = process.env.NODE_ENV !== 'production'
  const server = dev ? 'http://localhost:3000' : 'https://www.apemonitor.com'

  const getOpenseaData = async () => {
    const resp = await fetch(`${server}/api/opensea/${params?.address}`)
    return await resp.json()
  }

  const { collections } = await getOpenseaData()

  const totalStats = collections.reduce(
    (acc: any, collection: any) => {
      const numOwned = collection.assets.length
      const { total: singleCostBasis } = getCostBasis(collection)
      return {
        assetsOwned: acc.assetsOwned + numOwned,
        value: acc.value + collection.assets.length * collection.stats.floor_price,
        oneDayChange: acc.oneDayChange + numOwned * collection.stats.one_day_change,
        costBasis: acc.costBasis + singleCostBasis,
      }
    },
    { value: 0, oneDayChange: 0, assetsOwned: 0, costBasis: 0 },
  )

  return { props: { collections, address: params?.address, totalStats } }
}

export default AddressPage
