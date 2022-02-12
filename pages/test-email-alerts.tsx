import type { NextPage } from 'next'
import Head from 'next/head'
import toast, { Toaster } from 'react-hot-toast'

import CollectionsUpdateEmail, { WithDebug } from '../components/email/template'
import { collectionsWithAssets } from '../mock/collections-with-assets.json'
import { getServer, addressIsAdmin } from '../lib/util'
import Navbar from '../components/layout/navbar'
import useWeb3Container from '../hooks/useWeb3User'
import Button from '../components/util/button'

const TestPage: NextPage = () => {
  const { wallet } = useWeb3Container.useContainer()
  const isAdmin = wallet.account ? addressIsAdmin(wallet.account) : false

  const onSendEmail = () => {
    const endpoint = `${getServer()}/api/jobs/send-email-alerts?key=${process.env.SEND_EMAIL_KEY}`
    fetch(endpoint)
      .then((resp) => JSON.stringify(resp.json()))
      .then(() => toast.success('Sent email!'))
      .catch(toast.error)
  }
  const isConnected = wallet.isConnected()
  const onConnectClick = () => {
    wallet.connect('injected')
  }

  return (
    <div className="max-w-screen-xl m-auto pb-4 md:pb-12">
      <Navbar displaySearchbar={false} />
      <Head>
        <title>Testing Email Alerts</title>
      </Head>
      <Toaster />
      {!isConnected && !isAdmin && (
        <div className="flex flex-col items-center w-full md:mx-auto md:w-96 space-y-4 mt-64">
          <h1 className="text-2xl ">Testing Email Alerts Panel</h1>
          <Button onClick={onConnectClick}>Connect to Wallet</Button>
        </div>
      )}
      {isConnected && !isAdmin && (
        <div className="flex flex-col items-center w-full md:mx-auto md:w-96 space-y-4 mt-64">
          <h1 className="text ">You are not connected to an admin address.</h1>
        </div>
      )}

      {isAdmin && (
        <div className="flex flex-col space-y-4 mt-4">
          <div className="flex shadow border p-8">
            <Button onClick={onSendEmail}>Send Email</Button>
          </div>
          <div className="shadow border p-8">
            <CollectionsUpdateEmail
              title="test"
              collectionsWithAssets={collectionsWithAssets}
              address={'0xd6CB70a88bB0D8fB1be377bD3E48e603528AdB54'}
            />
            {/* <WithDebug debug title="test" collectionsWithAssets={collectionsWithAssets} /> */}
          </div>
        </div>
      )}
    </div>
  )
}

export default TestPage
