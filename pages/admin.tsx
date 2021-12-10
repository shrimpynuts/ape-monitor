import { useState, useEffect } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import toast, { Toaster } from 'react-hot-toast'

import useWeb3Container from '../hooks/useWeb3User'
import Navbar from '../components/layout/navbar'
import Button from '../components/util/button'
import { GET_COLLECTIONS_ADMIN_STATS } from '../graphql/queries'
import { useQuery } from '@apollo/client'
import Spinner from '../components/util/spinner'
import { getFormattedDate, getServer } from '../lib/util'

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

  const onFetchClick = async () => {
    console.log(`Hitting ${getServer()}/api/jobs/update-collections`)
    fetch(`${getServer()}/api/jobs/update-collections`)
      .then((resp) => resp.json())
      .then((value) => {
        console.log({ value })
        toast(value)
      })
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
          <div className="w-full md:mx-auto md:w-2/3 my-8 flex flex-col ">
            <div
              className="md:mx-auto md:w-1/2 my-8 flex flex-col
              py-2 sm:rounded-lg mb-2 shadow border border-solid border-gray-300 dark:border-darkblue
              divide-y divide-gray-300 dark:divide-darkblue"
            >
              <div className="flex justify-between p-2">
                <span># of Collections</span>
                <span>{data.total.aggregate.count}</span>
              </div>
              <div className="flex justify-between p-2">
                <span>floor_price == null</span>
                <span>{data.floor_price_null.aggregate.count}</span>
              </div>
              <div className="flex justify-between p-2">
                <span>one_day_change == null</span>
                <span>{data.one_day_change_null.aggregate.count}</span>
              </div>
              <div className="flex justify-between p-2">
                <span>is_stats_fetched == true</span>
                <span>{data.is_stats_fetched_true.aggregate.count}</span>
              </div>{' '}
              <div className="flex justify-between p-2">
                <span>Stale since {getFormattedDate(yesterday)}</span>
                <span>{data.stale.aggregate.count}</span>
              </div>
            </div>

            <div className="mt-4 flex space-x-4">
              <Button onClick={onRefetchClick}>Refetch</Button>
              <Button onClick={onFetchClick}>/api/jobs/update-collections</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminPage
