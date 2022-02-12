import React from 'react'
import { Email, renderEmail } from 'react-html-email'
import { ICollectionsWithAssets } from '../../frontend/types'
import CollectionsTable from './collectionsUpdate'

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
    .outer-table {
      @apply bg-red-500 sm:rounded-lg mb-2 shadow border border-solid border-gray-300 dark:border-darkblue;
    }
    .collection-image {
      width: 2rem;
      height: 2rem;
      border-radius: 9999px;
    }
    .collection-link {
      font-weight: inherit; 
      color: inherit;
      text-decoration: none;
    } 
  `.trim()

  return (
    <Email title={title} headCSS={css}>
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
