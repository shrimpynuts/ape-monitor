import React from 'react'
import { Email, renderEmail } from 'react-html-email'
import { ICollectionsWithAssets } from '../../frontend/types'
import CollectionsTable from './collectionsUpdate'
// import TopCollections from '../../components/topCollections'

interface CollectionsUpdateEmailProps {
  title: string
  collectionsWithAssets: ICollectionsWithAssets
}

const CollectionsUpdateEmail = ({ title, collectionsWithAssets }: CollectionsUpdateEmailProps) => {
  const css = `
    @media only screen and (max-device-width: 480px) {
      font-size: 20px !important;
      font-size: 20px !important;
    }
  `.trim()

  return (
    <Email title={title} headCSS={css}>
      {/* <TopCollections /> */}
      <CollectionsTable collectionsWithAssets={collectionsWithAssets} />
      <input type="radio" name="collapse" id="handle1" checked={true} />
      <h2 className="handle">
        <label title="handle1">The Visible Short Heading</label>
      </h2>
      <div className="content">
        <p>Your detailed contents...</p>
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
