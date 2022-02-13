import React from 'react'
import { Email, renderEmail } from 'react-html-email'
import { ICollectionsWithAssets } from '../../frontend/types'
import { middleEllipses, getRandomInt } from '../../lib/util'
import Emoji from '../util/emoji'
import CollectionsTable from './collectionsUpdate'
// import TopCollections from '../../components/topCollections'

interface CollectionsUpdateEmailProps {
  title: string
  collectionsWithAssets: ICollectionsWithAssets
  address: string
  ensDomain?: string
}

const CollectionsUpdateEmail = ({ title, address, collectionsWithAssets, ensDomain }: CollectionsUpdateEmailProps) => {
  const css = `
    @media only screen and (max-device-width: 480px) {
      font-size: 20px !important;
      font-size: 20px !important;
    }
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
          P.S. these are your collections with a non-zero floor/volume. You can view{' '}
          <a href={`https://apemonitor.com/${ensDomain ? ensDomain : address}`} target="_blank" rel="noreferrer">
            your entire portfolio here.
          </a>
        </p>
        <p style={{ marginLeft: '2rem', textAlign: 'left' }}>
          Reply to this email or{' '}
          <a href="https://twitter.com/jonathanmcai" target="_blank" rel="noreferrer">
            shoot me a DM
          </a>{' '}
          for bug reports, feature requests, or to unsubscribe if these get annoying. No hard feelings.
        </p>
      </div>
      <div style={{ marginTop: '2rem', marginBottom: '2rem' }}>
        <img style={{ width: '400px', margin: '0px auto', display: 'flex' }} src={apeGIF} />
      </div>
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
