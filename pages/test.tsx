import type { NextPage } from 'next'
import Head from 'next/head'
import toast, { Toaster } from 'react-hot-toast'

import CollectionsUpdateEmail, { WithDebug } from '../components/email/template'
import Button from '../components/util/button'
import { getServer } from '../lib/util'
import { collectionsWithAssets } from '../mock/collections-with-assets.json'
import Navbar from '../components/layout/navbar'

const TestPage: NextPage = () => {
  const onSendEmail = () => {
    fetch(`${getServer()}/api/jobs/send-email`)
      .then((resp) => JSON.stringify(resp.json()))
      .then(() => toast.success('Sent email!'))
      .catch(toast.error)
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
          <CollectionsUpdateEmail title="test" collectionsWithAssets={collectionsWithAssets} />
          {/* <WithDebug debug title="test" collectionsWithAssets={collectionsWithAssets} /> */}
        </div>
      </div>
    </div>
  )
}

export default TestPage
