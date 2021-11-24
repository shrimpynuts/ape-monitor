import { useState, useEffect } from 'react'

import { useMutation } from '@apollo/client'
import { GetServerSideProps } from 'next'
import { Toaster } from 'react-hot-toast'
import type { NextPage } from 'next'
import Head from 'next/head'

import { ITradeData, IAddressData, ICollectionsWithAssets } from '../frontend/types'
import ProfileBanner from '../components/profile/profileBanner'
import HighlightedTrades from '../components/highlightedTrades'
import Navbar from '../components/layout/navbar'
import AllTrades from '../components/allTrades'
import TabOptions from '../components/tabOptions'
import { INSERT_USER } from '../graphql/mutations'
import useWeb3Container from '../hooks/useWeb3User'
import CollectionsTable from '../components/collectionsTable'

import {
  middleEllipses,
  getServer,
  getNetworkAddress,
  isENSDomain,
  convertNumberToRoundedString,
  getENSDomain,
  fetchAllCollections,
  groupAssetsWithCollections,
} from '../lib/util'

/**
 * This is the main "profile" page, which displays a given address's portfolio
 * @param addressData Data about the given address from server side
 */
const ProfilePage: NextPage<IAddressData> = (addressData) => {
  const { wallet } = useWeb3Container.useContainer()
  const { address, ensDomain, addressFound } = addressData
  const [loading, setLoading] = useState(addressFound)
  const [insertUser] = useMutation(INSERT_USER)

  const [collectionsWithAssets, setCollectionsWithAssets] = useState<ICollectionsWithAssets>({})

  const [tradeData, setTradeData] = useState<ITradeData>()
  const [tradesLoading, setTradesLoading] = useState(true)

  /**
   * Tabs for the different displays on the portfolio page
   */
  const tabs = [
    {
      display: 'Current Portfolio',
      index: 0,
    },
    // Only allow the previous trades tab if trade data is available
    ...(tradeData
      ? [
          {
            display: 'Previous Trades',
            index: 1,
          },
        ]
      : []),
  ]
  const [currentTab, setCurrentTab] = useState(tabs[0])

  // /**
  //  * Updates the users data in our database (only if connected and is the owner of this wallet)
  //  */
  // useEffect(() => {
  //   // Make sure the user is connected and the address matches
  //   if (wallet.isConnected() && wallet.account === address) {
  //     // Upsert user into DB
  //     insertUser({
  //       variables: {
  //         user: {
  //           address: address,
  //           ensDomain: ensDomain,
  //           totalValue: openseaData.totalStats.totalValue,
  //           totalAssetCount: openseaData.totalStats.totalAssetCount,
  //           totalCostBasis: openseaData.totalStats.totalCostBasis,
  //         },
  //       },
  //     }).catch(console.error)
  //   }
  // }, [openseaData, wallet])

  /**
   * Fetches assets and collections, storing in state
   */
  useEffect(() => {
    const initialFetch = async () => {
      // Fetch all assets
      const { assets } = await fetch(`${getServer()}/api/opensea/assets/${address}`).then((res) => res.json())

      // Fetch all corresponding collections for the given assets
      const collections = await fetchAllCollections(assets)

      // Group the assets together with their collections
      const collectionsWithAssets = groupAssetsWithCollections(assets, collections)

      // Update the state accordingly
      setCollectionsWithAssets(collectionsWithAssets)
      setLoading(false)
    }

    // Only make fetch if we have an address
    if (addressFound) {
      setLoading(true)
      initialFetch()
    }
  }, [address])

  // /**
  //  * Fetches trade data, storing in state
  //  */
  // useEffect(() => {
  //   fetch(`${getServer()}/api/opensea/trades/${address}`)
  //     .then((resp) => resp.json())
  //     .then((data) => {
  //       setTradeData(data)
  //       setTradesLoading(false)
  //     })
  // }, [address])

  const metadataTitle = `${ensDomain ? ensDomain : middleEllipses(address, 4, 5, 2)}\'s NFT Portfolio`
  return (
    <div className="pb-4 md:pb-12">
      <Head>
        <title>{metadataTitle}</title>
        <meta name="description" content="NFT Monitor tracks NFT portfolios on the Ethereum network." />
        <link rel="icon" href="/favicon.ico" />

        {/* Open graph */}
        <meta property="og:url" content="https://www.apemonitor.com/" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={metadataTitle} />
        <meta property="og:description" content="Monitor the performance of your Ethereum NFTs using Opensea data." />
        <meta property="og:image" content="https://www.apemonitor.com/image-metadata.png" />

        {/* Twitter */}
        <meta property="twitter:url" content="https://www.apemonitor.com/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metadataTitle} />
        <meta name="twitter:description" content="Monitor the performance of your Ethereum NFTs using Opensea data." />
        <meta name="twitter:image" content="https://www.apemonitor.com/image-metadata.png" />
      </Head>
      <div className="bg-blue-500 dark:bg-black pb-16 md:pb-28 border-b light:border-gray-300 dark:border-darkblue">
        <div className="max-w-screen-xl m-auto ">
          <Navbar />
        </div>
      </div>

      <div className="max-w-screen-lg m-auto dark:bg-blackPearl">
        <div className="relative bottom-14">
          <ProfileBanner
            ensName={ensDomain ? ensDomain : middleEllipses(address, 4, 6, 4)}
            address={address}
            costBasis={convertNumberToRoundedString(1)}
            totalValue={convertNumberToRoundedString(1)}
            oneDayChange={convertNumberToRoundedString(1)}
          />
        </div>
        <Toaster />

        {/* Display best trades */}
        <div className="flex flex-col flex-wrap space-y-2 -mt-7 mx-4">
          <div className="flex space-x-4 ">
            <HighlightedTrades tradeData={tradeData} loading={tradesLoading} />
          </div>
        </div>

        {/* Display all tab options */}
        <TabOptions tabs={tabs} setCurrentTab={setCurrentTab} currentTab={currentTab} />

        {/* Current portfolio tab */}
        {currentTab.index === 0 && (
          <div className="max-w-screen-lg m-auto overflow-hidden mt-4">
            <div className="flex flex-col flex-wrap space-y-2 mx-4">
              <CollectionsTable collectionsWithAssets={collectionsWithAssets} loading={loading} />
            </div>
          </div>
        )}

        {/* Historical trades tab */}
        {currentTab.index === 1 && (
          <div className="max-w-screen-lg m-auto overflow-hidden mt-4">
            <div className="flex flex-col flex-wrap space-y-2 mx-4">
              <AllTrades tradeData={tradeData} loading={tradesLoading} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * Error in case getServerSideProps cannot resolve ENS domain or bad address given
 */
const error = () => {
  return {
    props: { address: 'could not find this ape :(', ensDomain: 'could not find this ape :(', addressFound: false },
  }
}

/**
 * Resolves the ENS domain if given, and passes the domain and associated address to the page
 */
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { params } = context
  const address = params?.address
  if (typeof address !== 'string') return error()

  // Fetches the network address (starts with "0x") if given an ENS domain
  const networkAddress = isENSDomain(address) ? await getNetworkAddress(address) : address
  if (!networkAddress) {
    console.error(`Could not find network address for ens domain ${address}`)
    return error()
  }

  // Fetch ENS domain if not given it
  const ensDomain = isENSDomain(address) ? address : await getENSDomain(address)

  // If the user gives address, but we find the ENS domain, redirect the user to the ENS domain
  if (!isENSDomain(address) && ensDomain) {
    return {
      redirect: {
        destination: `/${ensDomain}`,
        permanent: false,
      },
    }
  }

  return { props: { address: networkAddress, ensDomain, addressFound: true } }
}

export default ProfilePage
