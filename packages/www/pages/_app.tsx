import '../styles/globals.css'
import 'tailwindcss/tailwind.css'

import type { AppProps } from 'next/app'
import { ApolloProvider } from '@apollo/client'

import { ThemeProvider } from 'next-themes'
import Web3UserProvider from '../hooks/web3UserProvider'
import client from '../frontend/apollo-client'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class">
      <ApolloProvider client={client}>
        <div className="min-h-screen bg-white dark:bg-blackPearl dark:text-white">
          <Web3UserProvider>
            <Component {...pageProps} />
          </Web3UserProvider>
        </div>
      </ApolloProvider>
    </ThemeProvider>
  )
}
export default MyApp
