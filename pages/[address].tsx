import { useState, useEffect } from 'react'

import { useMutation } from '@apollo/client'
import { GetServerSideProps } from 'next'
import toast, { Toaster } from 'react-hot-toast'
import type { NextPage } from 'next'
import Head from 'next/head'

import { ITradeData, IAddressData, ICollectionsWithAssets } from '../frontend/types'
import ProfileBanner from '../components/profile/profileBanner'
import Navbar from '../components/layout/navbar'
import TradesTable from '../components/tradesTable'
import TabOptions from '../components/tabOptions'
import { INSERT_USER } from '../graphql/mutations'
import CollectionsTable from '../components/collectionsTable'
import Gallery from '../components/gallery'

import {
  middleEllipses,
  getServer,
  getNetworkAddress,
  isENSDomain,
  convertNumberToRoundedString,
  getENSDomain,
  fetchAllCollections,
  groupAssetsWithCollections,
  calculateTotalCostBasis,
  calculateTotalValue,
  calculateTotalChange,
  calculateTotalAssetCount,
} from '../lib/util'

/**
 * This is the main "profile" page, which displays a given address's portfolio
 * @param addressData Data about the given address from server side
 */
const ProfilePage: NextPage<IAddressData> = (addressData) => {
  const { address, ensDomain, addressFound } = addressData
  const [loading, setLoading] = useState(addressFound)
  const [insertUser] = useMutation(INSERT_USER)

  const [collectionsWithAssets, setCollectionsWithAssets] = useState<ICollectionsWithAssets>({})
  const totalCostBasis = calculateTotalCostBasis(collectionsWithAssets)
  const totalValue = calculateTotalValue(collectionsWithAssets)
  const totalAssetCount = calculateTotalAssetCount(collectionsWithAssets)

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
    {
      display: 'Gallery View',
      index: 1,
    },
    // Only allow the previous trades tab if trade data is available
    {
      display: 'Previous Trades',
      index: 2,
    },
  ]
  const [currentTab, setCurrentTab] = useState(tabs[0])

  /**
   * Updates the users data in our database (only if connected and is the owner of this wallet)
   */
  useEffect(() => {
    // Make sure the user is connected and the address matches
    if (addressFound) {
      // Upsert user into DB
      console.log(`Inserting new user ${address} ${ensDomain && `/ ${ensDomain}`}`)
      const newUser = {
        address: address,
        ensDomain: ensDomain,
        totalCostBasis,
        totalValue,
        totalAssetCount,
      }
      console.log({ newUser })
      insertUser({ variables: { user: newUser } }).catch(console.error)
    }
  }, [address, ensDomain, addressFound, collectionsWithAssets])

  /**
   * Fetches assets and collections, storing in state
   */
  useEffect(() => {
    const initialFetch = async () => {
      // Fetch all assets
      const result = await fetch(`${getServer()}/api/opensea/assets/${address}`).then((res) => res.json())
      const { assets, error } = result

      // Handle error (in case we get throttled)
      if (error) {
        toast.error(error)
        setLoading(false)
        return
      }

      // Fetch all corresponding collections for the given assets
      const collections = await fetchAllCollections(assets)

      // Group the assets together with their collections
      const collectionsWithAssets = groupAssetsWithCollections(assets, collections)

      // Update the state accordingly
      setCollectionsWithAssets(collectionsWithAssets)

      console.log({ collectionsWithAssets })

      setLoading(false)
    }

    // Only make fetch if we have an address
    if (addressFound) {
      setLoading(true)
      initialFetch()
    }
  }, [address, addressFound])

  /**
   * Fetches trade data, storing in state
   */
  useEffect(() => {
    fetch(`${getServer()}/api/opensea/trades/${address}`)
      .then((resp) => resp.json())
      .then((data) => {
        setTradeData(data)
        setTradesLoading(false)
      })
      .catch(() => {
        toast.error(`Opensea throttled request for trades!`)
        setTradesLoading(false)
      })
  }, [address])

  const metadataTitle = addressFound
    ? `${ensDomain ? ensDomain : middleEllipses(address, 4, 5, 2)}\'s NFT Portfolio`
    : 'Oopsies!'
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
        {/* Display profile banner */}
        <div className="relative bottom-14">
          <ProfileBanner
            ensName={ensDomain ? ensDomain : middleEllipses(address, 4, 6, 4)}
            address={address}
            costBasis={convertNumberToRoundedString(totalCostBasis)}
            totalValue={convertNumberToRoundedString(totalValue)}
            oneDayChange={convertNumberToRoundedString(calculateTotalChange(collectionsWithAssets))}
          />
        </div>

        {/* Toaster to give user feedback */}
        <Toaster />

        {/* Display best trades */}
        {/* <div className="flex flex-col flex-wrap space-y-2 -mt-7 mx-4">
          <div className="flex space-x-4 ">
            <HighlightedTrades tradeData={tradeData} loading={tradesLoading} />
          </div>
        </div> */}

        {/* Display all tab options */}
        <div className="max-w-screen-lg m-auto overflow-hidden">
          <TabOptions tabs={tabs} setCurrentTab={setCurrentTab} currentTab={currentTab} />
        </div>

        {/* Portfolio tab */}
        {currentTab.index === 0 && (
          <div className="max-w-screen-lg m-auto overflow-hidden mt-4">
            <div className="flex flex-col flex-wrap space-y-2 mx-4">
              <CollectionsTable collectionsWithAssets={collectionsWithAssets} loading={loading} />
            </div>
          </div>
        )}

        {/* Gallery tab */}
        {currentTab.index === 1 && (
          <div className="max-w-screen-lg m-auto overflow-hidden mt-4">
            <div className="flex flex-col flex-wrap space-y-2 mx-4">
              <Gallery collectionsWithAssets={collectionsWithAssets} loading={loading} />
            </div>
          </div>
        )}

        {/* Historical trades tab */}
        {currentTab.index === 2 && (
          <div className="max-w-screen-lg m-auto overflow-hidden mt-4">
            <div className="flex flex-col flex-wrap space-y-2 mx-4">
              <TradesTable tradeData={tradeData} loading={tradesLoading} addressData={addressData} />
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
