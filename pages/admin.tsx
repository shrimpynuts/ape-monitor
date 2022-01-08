import { useState, useEffect } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import toast, { Toaster } from 'react-hot-toast'

import { GET_COLLECTIONS_ADMIN_STATS } from '../graphql/queries'
import AdminDataPanel from '../components/admin/dataPanel'
import useWeb3Container from '../hooks/useWeb3User'
import Navbar from '../components/layout/navbar'
import Spinner from '../components/util/spinner'
import Tooltip from '../components/util/tooltip'
import Button from '../components/util/button'
import { useQuery } from '@apollo/client'
import { getServer, addressIsAdmin } from '../lib/util'

// Dates used for retrieving the staleness of data
const oneHour = 60 * 60 * 1000
const oneDay = 24 * oneHour
export const lastUpdated1 = new Date(new Date().getTime() - oneHour) // 1 hour
export const lastUpdated2 = new Date(new Date().getTime() - oneDay) // 1 day
export const lastUpdated3 = new Date(new Date().getTime() - oneDay * 3) // 3 days
export const lastUpdated4 = new Date(new Date().getTime() - oneDay * 7) // 7 days

const AdminPage: NextPage = () => {
  const { wallet } = useWeb3Container.useContainer()
  const [modalIsOpen, setModalIsOpen] = useState(false)

  const variables = {
    lastUpdated1: lastUpdated1.toUTCString(),
    lastUpdated2: lastUpdated2.toUTCString(),
    lastUpdated3: lastUpdated3.toUTCString(),
    lastUpdated4: lastUpdated4.toUTCString(),
  }
  const { data, loading, refetch: refresh } = useQuery(GET_COLLECTIONS_ADMIN_STATS, { variables })

  useEffect(() => {
    wallet.connect('injected')
  }, [])

  const onConnectClick = () => {
    wallet.connect('injected')
  }

  const onRefreshClick = async () => {
    toast.promise(refresh(variables), {
      loading: 'Refreshing...',
      success: 'Done refreshing.',
      error: (err) => err.toString(),
    })
  }

  const onFetchClick = async () => {
    toast.promise(
      fetch(`${getServer()}/api/jobs/update-collections`)
        .then((resp) => resp.json())
        .then((value) => {
          const { error, message } = value
          if (error) throw Error(message)
          return message
        }),
      {
        loading: 'Updating collections...',
        success: (data) => {
          // Refresh stats when done updating collections
          // refresh(variables)
          return data
        },
        error: (err) => err.toString(),
      },
    )
  }

  const onFetchNewClick = async () => {
    toast.promise(
      fetch(`${getServer()}/api/jobs/update-new-collections`)
        .then((resp) => resp.json())
        .then((value) => {
          const { error, message } = value
          if (error) throw Error(message)
          return message
        }),
      {
        loading: 'Updating collections...',
        success: (data) => {
          // Refresh stats when done updating collections
          // refresh(variables)
          return data
        },
        error: (err) => err.toString(),
      },
    )
  }

  const isConnected = wallet.isConnected()
  const isAdmin = wallet.account ? addressIsAdmin(wallet.account) : false

  return (
    <div className="max-w-screen-xl m-auto pb-4 md:pb-12">
      <Head>
        <title>Admin</title>
      </Head>
      <Toaster
        toastOptions={{
          position: 'bottom-left',
        }}
      />
      <Navbar
        displaySearchbar={isAdmin}
        displayConnectButton={isAdmin}
        customState={{ modalIsOpen, setModalIsOpen }}
        redirectToProfileOnConnect={false}
      />
      <div className="px-4 w-full mt-4">
        {!isConnected && !isAdmin && (
          <div className="flex flex-col items-center w-full md:mx-auto md:w-96 space-y-4 mt-64">
            <h1 className="text-2xl ">Admin Panel</h1>
            <Button onClick={onConnectClick}>Connect to Wallet</Button>
          </div>
        )}
        {isConnected && !isAdmin && (
          <div className="flex flex-col items-center w-full md:mx-auto md:w-96 space-y-4 mt-64">
            <h1 className="text ">You are not connected to an admin address.</h1>
          </div>
        )}
        {loading && (
          <div className="flex flex-col items-center w-full md:mx-auto md:w-96 space-y-4 mt-64">
            <Spinner />
          </div>
        )}
        {isAdmin && data && (
          <div className="w-full md:mx-auto flex flex-col ">
            <div className="flex flex-row space-x-2 mb-4 items-start w-1/2 mx-auto">
              <div className="flex relative space-x-2 items-center justify-center">
                <Tooltip width={64} text="Refreshes this admin panel" />
                <Button onClick={onRefreshClick}>Refresh</Button>
              </div>

              <div className="flex relative space-x-2 items-center justify-center">
                <Tooltip width={64} text="Hits /api/jobs/update-collections" />
                <Button onClick={onFetchClick}>Update Collections</Button>
              </div>

              <div className="flex relative space-x-2 items-center justify-center">
                <Tooltip width={64} text="Hits /api/jobs/update-new-collections" />
                <Button onClick={onFetchNewClick}>Update New Collections</Button>
              </div>
            </div>
            <AdminDataPanel data={data} />
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminPage
