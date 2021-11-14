import { useState } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import { Toaster } from 'react-hot-toast'

import Searchbar from '../components/searchbar'
import Navbar from '../components/navbar'
import Button from '../components/button'

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max) + 1
}

const Home: NextPage = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false)
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
      <Navbar displaySearchbar={false} displayConnectButton={false} customState={{ modalIsOpen, setModalIsOpen }} />
      <div className="px-4 w-full">
        <div className="flex flex-col items-center w-full md:mx-auto md:w-96 my-8">
          <div className="w-full">
            <Searchbar autoFocus />
          </div>
          <span className="my-2">OR</span>
          <Button onClick={() => setModalIsOpen(true)}>Connect to Wallet</Button>
        </div>
        <img className="m-auto sm:w-full md:w-96" src={`/apes/ape${getRandomInt(8)}.gif`} />
      </div>
    </div>
  )
}

export default Home
