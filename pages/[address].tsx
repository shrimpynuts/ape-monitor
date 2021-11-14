import { GetServerSideProps } from 'next'
import type { NextPage } from 'next'
import Head from 'next/head'
import { Toaster } from 'react-hot-toast'
import Davatar from '@davatar/react'

import Navbar from '../components/navbar'
import { middleEllipses, fixedNumber, getCostBasis, getNetworkAddress, isENSDomain } from '../lib/util'
import CollectionsTable from '../components/collectionsTable'
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
  console.log({ collections })

  return (
    <div className="max-w-screen-xl m-auto pb-4 md:pb-12">
      <Head>
        <title>{ensDomain ? ensDomain : middleEllipses(address, 4, 5, 2)}&apos;s NFT Portfolio</title>
        <meta name="description" content="NFT Monitor tracks NFT portfolios on the Ethereum network." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Toaster />
      <Navbar />

      {/* Display profile details */}
      <div
        className="flex flex-col px-2 py-4 space-y-4 md:space-y-0 mx-4 shadow sm:rounded-lg bg-gray-100 dark:bg-gray-850 text-gray-500 dark:text-gray-100
      md:flex-row md:items-center md:divide-x divide-gray-200 dark:divide-gray-700"
      >
        <div className="flex text-lg px-4 space-x-2 items-center">
          <Davatar
            size={20}
            address={address}
            generatedAvatarType="jazzicon" // optional, 'jazzicon' or 'blockies'
          />
          <h4 className="text-lg ">{ensDomain ? ensDomain : middleEllipses(address, 4, 6, 4)}</h4>
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

      {/* Display collections data */}
      <div className="flex flex-col flex-wrap space-y-2 mt-4 mx-4">
        <CollectionsTable collections={collections} />
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
  const ensDomain = isENSDomain(address) ? address : undefined

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
