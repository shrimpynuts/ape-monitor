import React from 'react'
import { Email, renderEmail } from 'react-html-email'
import { ICollectionsWithAssets } from '../../frontend/types'
import { middleEllipses } from '../../lib/util'
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
  `.trim()

  return (
    <Email title={title} headCSS={css}>
      <h2 style={{ marginLeft: '4rem', fontWeight: 'bold', textAlign: 'left' }}>{`${
        ensDomain ? ensDomain : middleEllipses(address, 4, 5, 2)
      }`}</h2>
      <p style={{ marginLeft: '4rem', textAlign: 'left' }}>Here&apos;s how your NFT&apos;s are doing:</p>
      <CollectionsTable collectionsWithAssets={collectionsWithAssets} />
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
