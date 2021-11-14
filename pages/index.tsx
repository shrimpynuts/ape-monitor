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
      </Head>
      <Toaster />
      <Navbar displaySearchbar={false} displayConnectButton={false} customState={{ modalIsOpen, setModalIsOpen }} />
      <div className="px-4 w-full">
        <div className="flex flex-col items-center w-full md:mx-auto md:w-96 my-8 space-x-4">
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
