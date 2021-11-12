import { GetServerSideProps } from 'next'
import type { NextPage } from 'next'
import Head from 'next/head'
import { Toaster } from 'react-hot-toast'

import Navbar from '../components/navbar'
import { middleEllipses, fixedNumber } from '../lib/util'
import CollectionsTable from '../components/collectionsTable'
import DeltaDisplay from '../components/deltaDisplay'

const AddressPage: NextPage = ({
  collections,
  address,
  totalStats: { totalOneDayChange, totalValue, totalAssetsOwned },
}: any) => {
  return (
    <div className="max-w-screen-xl m-auto pb-4 md:pb-12">
      <Head>
        <title>Web 3 Starter Project</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Toaster />
      <Navbar />
      <div className="flex flex-col space-y-4 mx-4">
        <h4 className="text-lg ">Address: {middleEllipses(address, 4, 6, 4)}</h4>
        <div className="flex space-x-4">
          <h4 className="text-lg ">{collections.length} collections</h4>
          <h4 className="text-lg ">{totalAssetsOwned} NFTs</h4>
          <h4 className="text-lg ">
            Total value: {fixedNumber(totalValue)}Ξ <DeltaDisplay delta={totalOneDayChange} denomination="Ξ" />
          </h4>
        </div>
      </div>
      <div className="flex flex-col flex-wrap space-y-2 mt-8 mx-4">
        <CollectionsTable collections={collections} />
      </div>
      {/* <div className="flex flex-col flex-wrap space-y-2 mt-8 mx-4">
        {collections
          .sort((collectionA: any, collectionB: any) => {
            return collectionB.stats.floor_price - collectionA.stats.floor_price
          })
          .map((collection: any, i: number) => {
            const change = collection.stats.one_day_change
            const numOwned = collection.assets.length
            // console.log({ [collection.slug]: collection.stats })
            return (
              <div key={i} className="flex space-x-4 justify-between w-full items-center">
                <div className="flex space-x-4">
                  <img src={collection.image_url} className="h-8 w-8" />
                  <span>{numOwned}x</span>
                  <span>{collection.name}</span>
                </div>
                <div className="flex space-x-4">
                  <span className="self-center">
                    <a href={`https://opensea.io/collection/${collection.slug}`} target="_blank" rel="noreferrer">
                      <img src="/opensea.png" width={18} />
                    </a>
                  </span>
                  <DeltaDisplay delta={change} denomination="Ξ" />
                  <span>{fixedNumber(collection.stats.floor_price)}Ξ</span>
                  <span>{fixedNumber(numOwned * collection.stats.floor_price)}Ξ</span>
                  <span>{collection.stats.total_supply}</span>
                  <span>{fixedNumber(collection.stats.total_volume)}Ξ</span>
                </div>
              </div>
            )
          })}
      </div> */}
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { params } = context

  const dev = process.env.NODE_ENV !== 'production'
  const server = dev ? 'http://localhost:3000' : 'https://nft-monitor.vercel.app'

  const getOpenseaData = async () => {
    const resp = await fetch(`${server}/api/opensea/${params?.address}`)
    return await resp.json()
  }

  const { collections } = await getOpenseaData()

  const totalStats = collections.reduce(
    (acc: any, collection: any) => {
      const numOwned = collection.assets.length
      return {
        totalAssetsOwned: acc.totalAssetsOwned + numOwned,
        totalValue: acc.totalValue + collection.assets.length * collection.stats.floor_price,
        totalOneDayChange: acc.totalOneDayChange + numOwned * collection.stats.one_day_change,
      }
    },
    { totalValue: 0, totalOneDayChange: 0, totalAssetsOwned: 0 },
  )

  return { props: { collections, address: params?.address, totalStats } }
}

export default AddressPage
