import type { NextPage } from 'next'
import Head from 'next/head'
import toast, { Toaster } from 'react-hot-toast'

import CollectionsUpdateEmail from '../components/email/template'
import { collectionsWithAssets } from '../mock/collections-with-assets.json'
import { totalVolume, marketCap } from '../mock/top-collections.json'
import Navbar from '../components/layout/navbar'
import Button from '../components/util/button'

const TestPage: NextPage = () => {
  const onSendEmail = () => {
    toast('Not using this page anymore, use the direct URL.')
  }

  return (
    <div className="max-w-screen-xl m-auto pb-4 md:pb-12">
      <Navbar displaySearchbar={false} />
      <Head>
        <title>Testing Email Alerts</title>
      </Head>
      <Toaster />
      <div className="flex flex-col space-y-4 mt-4">
        <div className="flex shadow border p-8">
          <Button onClick={onSendEmail}>Send Email</Button>
        </div>
        <div className="shadow border p-8">
          <CollectionsUpdateEmail
            title="test"
            // @ts-ignore
            topCollectionsByTotalVolume={totalVolume}
            // @ts-ignore
            topCollectionsByOneDayVolume={marketCap}
            collectionsWithAssets={collectionsWithAssets}
            address={'0xd6CB70a88bB0D8fB1be377bD3E48e603528AdB54'}
          />
          {/* <WithDebug debug title="test" collectionsWithAssets={collectionsWithAssets} /> */}
        </div>
      </div>
    </div>
  )
}

export default TestPage
