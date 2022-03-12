import React from 'react'
import { Email, renderEmail } from 'react-html-email'
import { ICollection, ICollectionsWithAssets } from '../../frontend/types'
import { middleEllipses, getRandomInt } from '../../lib/util'
import Emoji from '../util/emoji'
import CollectionsTable from './collectionsUpdate'
import TopCollectionsUpdate from './topCollectionsUpdate'

interface CollectionsUpdateEmailProps {
  title: string
  collectionsWithAssets: ICollectionsWithAssets
  topCollectionsByTotalVolume: ICollection[]
  topCollectionsByOneDayVolume: ICollection[]
  address: string
  ensDomain?: string
}

const signatures = [
  'See ya tomorrow',
  'xoxo',
  'Cya',
  'Make it a good one',
  'Protect your seed phrase',
  'Later',
  'Ape together, strong',
  '',
  '',
  '',
  '',
]

const CollectionsUpdateEmail = ({
  title,
  address,
  collectionsWithAssets,
  topCollectionsByTotalVolume,
  topCollectionsByOneDayVolume,
  ensDomain,
}: CollectionsUpdateEmailProps) => {
  const css = `
    // @media only screen and (max-device-width: 480px) {
    //   font-size: 20px !important;
    // }
    .collection-row:hover {
      background-color: #F3F4F6;
    }
  `.trim()
  const apeGIF = `https://www.apemonitor.com/apes/ape${getRandomInt(25)}.gif`
  return (
    <Email title={title} headCSS={css}>
      <div style={{ margin: '0px auto', display: 'flex' }}>
        <a
          style={{ margin: '0px auto', display: 'flex', textDecoration: 'none' }}
          href="https://www.apemonitor.com/"
          target="_blank"
          rel="noreferrer"
        >
          <Emoji style={{ fontSize: '2.25rem', lineHeight: '3rem' }} label="logo" symbol="🦧" />
        </a>
      </div>
      <div style={{ marginTop: '2rem' }}>
        <h2 style={{ marginLeft: '2rem', fontWeight: 'bold', textAlign: 'left' }}>{`${
          ensDomain ? ensDomain : middleEllipses(address, 4, 5, 2)
        }`}</h2>
        <p style={{ marginLeft: '2rem', textAlign: 'left' }}>Gm. Here&apos;s how your NFT&apos;s are doing today:</p>
        <CollectionsTable collectionsWithAssets={collectionsWithAssets} />
        <p style={{ marginLeft: '2rem', textAlign: 'left' }}>
          (These are only your NFTs with non-zero recent volume. View your entire portfolio{' '}
          <a href={`https://apemonitor.com/${ensDomain ? ensDomain : address}`} target="_blank" rel="noreferrer">
            here.
          </a>
          )
        </p>

        <h2 style={{ marginLeft: '2rem', fontWeight: 'bold', textAlign: 'left' }}>
          <Emoji style={{ fontSize: '1.5rem', lineHeight: '2rem', marginRight: '1rem' }} label="logo" symbol="🏆" />
          Top Collections
        </h2>
        <p style={{ marginLeft: '2rem', textAlign: 'left' }}>Here&apos;s how some of the blue chips are doing:</p>
        <TopCollectionsUpdate topCollections={topCollectionsByTotalVolume} />

        <h2 style={{ marginLeft: '2rem', fontWeight: 'bold', textAlign: 'left' }}>
          <Emoji style={{ fontSize: '1.5rem', lineHeight: '2rem', marginRight: '1rem' }} label="logo" symbol="👀" />
          Trending Collections
        </h2>
        <p style={{ marginLeft: '2rem', textAlign: 'left' }}>
          Some NFT collections on the rise that you might want to watch out for (low market cap, high 24hr volume):
        </p>
        <TopCollectionsUpdate topCollections={topCollectionsByOneDayVolume} />
        <p style={{ marginLeft: '2rem', textAlign: 'left' }}>Let me know what you thought about this email!</p>
        <p style={{ marginLeft: '2rem', textAlign: 'left' }}>Was it useful? Too noisey? Anything look weird?</p>
        <p style={{ marginLeft: '2rem', textAlign: 'left' }}>
          Reply to this email or{' '}
          <a href="https://twitter.com/jonathanmcai" target="_blank" rel="noreferrer">
            shoot me a DM
          </a>{' '}
          for feedback, or to unsubscribe from this list. No hard feelings.
        </p>
      </div>
      <div style={{ marginTop: '2rem', marginBottom: '2rem' }}>
        <img style={{ width: '400px', margin: '0px auto', display: 'flex' }} src={apeGIF} />
      </div>
      <p style={{ marginLeft: '2rem', textAlign: 'left' }}>{signatures[getRandomInt(signatures.length - 1)]}</p>
      <p style={{ marginLeft: '2rem', textAlign: 'left' }}>- Johnny</p>
    </Email>
  )
}

export const WithDebug = (props: any) => {
  const { debug, ...rest } = props

  return (
    <>
      {/* <CollectionsUpdateEmail {...rest} /> */}
      <div dangerouslySetInnerHTML={{ __html: renderEmail(<CollectionsUpdateEmail {...rest} />) }} />
      {/* <code>{debug && renderEmail(<CollectionsUpdateEmail {...rest} />)}</code> */}
    </>
  )
}

export default CollectionsUpdateEmail
