import '../styles/globals.css'
import 'tailwindcss/tailwind.css'

import type { AppProps } from 'next/app'
import { ApolloProvider } from '@apollo/client'

import { ThemeProvider } from 'next-themes'
import { UseWalletProvider } from 'use-wallet'
import Web3UserProvider from '../hooks/web3UserProvider'
import client from '../lib/apollo-client'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class">
      <ApolloProvider client={client}>
        <div className="min-h-screen bg-white dark:bg-blackPearl dark:text-white">
          <UseWalletProvider
            connectors={{
              walletconnect: {
                // TODO: support testnet configurations
                // chainId 1 is mainnet
                chainId: 1,
                rpcUrl: 'https://eth-mainnet.alchemyapi.io/v2/GBjvplStTQ2x1FiAa5-5Qdyv2_8ZBuwe',
              },
            }}
          >
            <Web3UserProvider>
              <Component {...pageProps} />
            </Web3UserProvider>
          </UseWalletProvider>
        </div>
      </ApolloProvider>
    </ThemeProvider>
  )
}
export default MyApp
