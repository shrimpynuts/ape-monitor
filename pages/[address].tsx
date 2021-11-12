import { GetServerSideProps } from 'next'
import type { NextPage } from 'next'
import Head from 'next/head'
import { Toaster } from 'react-hot-toast'

import Navbar from '../components/navbar'
import { middleEllipses } from '../lib/util'

const AddressPage: NextPage = ({ assetsByCollection, address }: any) => {
  return (
    <div className="max-w-screen-xl m-auto pb-4 md:pb-12">
      <Head>
        <title>Web 3 Starter Project</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Toaster />
      <Navbar />
      <div className="flex flex-col space-y-4">
        <h4 className="text-lg ">Address: {middleEllipses(address, 4, 6, 4)}</h4>
        <h4 className="text-lg ">{Object.keys(assetsByCollection).length} collections</h4>
      </div>
      <div className="flex flex-col space-x-2 flex-wrap space-y-2 mt-8 ">
        {Object.keys(assetsByCollection).map((collectionSlug: any, i: number) => {
          const collection = assetsByCollection[collectionSlug]
          const change = collection.stats.one_day_change
          return (
            <div key={i} className="flex space-x-4 justify-between">
              <div className="flex space-x-4">
                <img src={collection.image_url} width="40" height="40" />
                <span>{collection.assets.length}x</span>
                <span>{collection.name}</span>
              </div>
              <div className="flex space-x-4">
                <span className={`${change > 0 ? 'text-green-500' : 'text-red-500'}`}>{change}Ξ</span>
                <span>{collection.stats.floor_price}Ξ</span>
                <span>{(collection.assets.length * collection.stats.floor_price).toFixed(3)}Ξ</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { params } = context

  const dev = process.env.NODE_ENV !== 'production'
  const server = dev ? 'http://localhost:3000' : 'https://nft-monitor.vercel.app'

  const getOpenseaAssetsByCollection = async () => {
    const resp = await fetch(`${server}/api/opensea/${params?.address}`)
    return await resp.json()
  }

  const assetsByCollection = await getOpenseaAssetsByCollection()
  console.log({ assetsByCollection })
  return { props: { assetsByCollection, address: params?.address } }
}

export default AddressPage
