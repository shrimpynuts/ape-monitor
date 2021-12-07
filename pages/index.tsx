import { useState } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import { Toaster } from 'react-hot-toast'

import useWeb3Container from '../hooks/useWeb3User'
import Leaderboard from '../components/leaderboard'
import Searchbar from '../components/searchbar'
import Navbar from '../components/layout/navbar'
import Button from '../components/util/button'
import TopCollections from '../components/topCollections'

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max) + 1
}

const Home: NextPage = () => {
  const { wallet } = useWeb3Container.useContainer()
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [shouldRedirectToProfile, setShouldRedirectToProfile] = useState(false)

  const onConnectClick = () => {
    setShouldRedirectToProfile(true)
    setModalIsOpen(true)
  }

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
      <Toaster />
      <Navbar
        displaySearchbar={false}
        displayConnectButton={false}
        customState={{ modalIsOpen, setModalIsOpen }}
        redirectToProfileOnConnect={shouldRedirectToProfile}
      />
      <div className="px-4 w-full mt-4">
        <div className="flex flex-col items-center w-full md:mx-auto md:w-96 space-y-4">
          {wallet.status !== 'connected' && (
            <>
              <div className="w-full">
                <Searchbar autoFocus />
              </div>
              <span className="my-2">or</span>
              <Button onClick={onConnectClick}>Connect to Wallet</Button>
            </>
          )}
        </div>
        <div className="w-full md:mx-auto md:w-2/3 my-8">
          <Leaderboard />
        </div>
      </div>
      <div className="max-w-screen-lg m-auto overflow-hidden mt-4">
        <div className="flex flex-col flex-wrap space-y-2 mx-4">
          <TopCollections />
        </div>
      </div>
    </div>
  )
}

export default Home
