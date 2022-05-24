import { useState } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'

import useWeb3Container from '../hooks/useWeb3User'
import Searchbar from '../components/searchbar'
import Navbar from '../components/layout/navbar'
import Button from '../components/util/button'
import TopCollections from '../components/topCollections'
import InfiniteTypist from '../components/infiniteTypist'

const Home: NextPage = () => {
  const { wallet } = useWeb3Container.useContainer()
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [shouldRedirectToProfile, setShouldRedirectToProfile] = useState(false)

  const onConnectClick = () => {
    setShouldRedirectToProfile(true)
    setModalIsOpen(true)
  }

  const colorObjects = {
    gold: 'linear-gradient(180deg, #FFF6EA 0%, #FFC876 100%)',
    blue: 'linear-gradient(182.18deg, #F7FBFF -18.82%, #F0F8FF -18.82%, #70C3FF 98.17%)',
    green: 'linear-gradient(178.53deg, #D6FFD6 36.05%, #9AFF98 80.15%)',
    purple: 'linear-gradient(180deg, #ABB0FF 15.48%, #DCDEFF 15.48%, #8F95F7 100%)',
    red: 'linear-gradient(180deg, #FFC6C6 0%, #FF7B7B 85.71%)',
    pink: 'linear-gradient(180deg, #FFC6F9 -5.95%, #FFB1F3 46.97%, #FF7BE2 91.67%)',
  }
  const colorVals = Object.values(colorObjects)

  return (
    <div className="max-w-screen-xl m-auto pb-4 md:pb-12">
      <Head>
        <title>Ape Monitor</title>
        <meta name="description" content="Monitor the performance of your Ethereum NFTs using Opensea data." />
        <link rel="icon" href="/favicon.ico" />

        {/* Open graph */}
        <meta property="og:url" content="https://www.apemonitor.com/" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Ape Monitor - Track your NFT portfolio." />
        <meta property="og:description" content="Monitor the performance of your Ethereum NFTs using Opensea data." />
        <meta property="og:image" content="https://www.apemonitor.com/image-metadata.png" />

        {/* Twitter */}
        <meta property="twitter:url" content="https://www.apemonitor.com/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Ape Monitor - Track your NFT portfolio." />
        <meta name="twitter:description" content="Monitor the performance of your Ethereum NFTs using Opensea data." />
        <meta name="twitter:image" content={'https://www.apemonitor.com/image-metadata.png'} />
      </Head>
      <Navbar
        displaySearchbar={false}
        displayConnectButton={false}
        customState={{ modalIsOpen, setModalIsOpen }}
        redirectToProfileOnConnect={shouldRedirectToProfile}
      />

      {/* Hero section */}
      <section className="flex flex-col lg:flex-row md:mx-8">
        {/* Left side: Title and description */}
        <div className="px-4 w-full mt-12">
          <h1 className="text-5xl md:text-7xl font-bold tracking-wide text-gray-800 dark:text-gray-100 ">
            Ape Monitor
          </h1>
          <h2 className="text-xl md:text-3xl mt-2 text-gray-800 dark:text-gray-100">Track your NFT portfolio.</h2>
          <h2 className="text-xl md:text-3xl mt-1 text-gray-800 dark:text-gray-100 inline-flex">
            <span className="mr-2">Discover the next</span>
            <InfiniteTypist
              colorValues={colorVals.slice(0, 6)}
              words={[
                'Bored Ape Yacht Club',
                'Cool Cats',
                'Doodles',
                'Cryptopunks',
                'Pudgy Penguins',
                'Loot',
                'World of Women',
                'Meebits',
                'Chain Runners',
              ]}
            />
            .
          </h2>
        </div>

        {/* Right side: Searchbar and connect to wallet (call to action) */}
        <div className="px-4 w-full mt-8 md:mt-20">
          <div className="flex flex-col items-center w-full md:mx-auto md:w-96 space-y-2">
            {wallet.status !== 'connected' && (
              <>
                <div className="w-full">
                  <Searchbar autoFocus />
                </div>
                {/* <span>or</span>
                <Button onClick={onConnectClick}>Connect to Wallet</Button> */}
              </>
            )}
          </div>
        </div>
      </section>

      {/* Top collections section */}
      <section className="m-auto overflow-hidden mt-2 md:mt-8">
        <div className="flex flex-col flex-wrap space-y-2 mx-4">
          <TopCollections />
        </div>
      </section>
    </div>
  )
}

export default Home
