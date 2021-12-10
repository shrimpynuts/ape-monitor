import { useState, useEffect } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import { Toaster } from 'react-hot-toast'

import useWeb3Container from '../hooks/useWeb3User'
import Navbar from '../components/layout/navbar'
import Button from '../components/util/button'
import { GET_COLLECTIONS_ADMIN_STATS } from '../graphql/queries'
import { useQuery } from '@apollo/client'
import Spinner from '../components/util/spinner'
import { getFormattedDate } from '../lib/util'

const AdminPage: NextPage = () => {
  const { wallet } = useWeb3Container.useContainer()
  const [modalIsOpen, setModalIsOpen] = useState(false)

  const yesterday = new Date(new Date().getTime() - 24 * 60 * 60 * 1000)
  const { data, loading, error, refetch } = useQuery(GET_COLLECTIONS_ADMIN_STATS, {
    variables: {
      lastUpdated: yesterday.toUTCString(),
    },
  })

  useEffect(() => {
    wallet.connect('injected')
  }, [])

  const onConnectClick = () => {
    wallet.connect('injected')
    // setModalIsOpen(true)
  }

  const onRefetchClick = async () => {
    refetch({ lastUpdated: yesterday.toUTCString() })
  }

  const adminAccounts = ['0xf725a0353dbB6aAd2a4692D49DDa0bE241f45fD0', '0xd6CB70a88bB0D8fB1be377bD3E48e603528AdB54']
  const isAdmin = wallet.account ? adminAccounts.includes(wallet.account) : false

  return (
    <div className="max-w-screen-xl m-auto pb-4 md:pb-12">
      <Head>
        <title>Admin</title>
      </Head>
      <Toaster />
      <Navbar
        displaySearchbar={isAdmin}
        displayConnectButton={isAdmin}
        customState={{ modalIsOpen, setModalIsOpen }}
        redirectToProfileOnConnect={false}
      />
      <div className="px-4 w-full mt-4">
        {!isAdmin && (
          <div className="flex flex-col items-center w-full md:mx-auto md:w-96 space-y-4 mt-64">
            <h1 className="text-2xl ">Admin Panel</h1>
            <Button onClick={onConnectClick}>Connect to Wallet</Button>
          </div>
        )}
        {loading && (
          <div className="flex flex-col items-center w-full md:mx-auto md:w-96 space-y-4 mt-64">
            <Spinner />
          </div>
        )}
        {data && (
          <div className="w-full md:mx-auto md:w-2/3 my-8 flex flex-col">
            <span># of Collections: {data.total.aggregate.count}</span>
            <span>floor_price == null: {data.floor_price_null.aggregate.count}</span>
            <span>one_day_change == null: {data.one_day_change_null.aggregate.count}</span>
            <span>is_stats_fetched == true: {data.is_stats_fetched_true.aggregate.count}</span>
            <span>
              Stale since {getFormattedDate(yesterday)}: {data.stale.aggregate.count}
            </span>

            <div className="mt-4">
              <Button onClick={onRefetchClick}>Refetch</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminPage
