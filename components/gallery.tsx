import Link from 'next/link'

import { getAllAssetsFromCollections } from '../lib/opensea/collections'
import { ICollectionsWithAssets, IAsset } from '../frontend/types'

interface IProps {
  collectionsWithAssets: ICollectionsWithAssets
  loading: boolean
}

function CollectionsTable({ collectionsWithAssets, loading }: IProps) {
  const allAssets: IAsset[] = getAllAssetsFromCollections(collectionsWithAssets)

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-4">
      {allAssets.map(({ image_url, link }) => {
        const image = (
          <img src={image_url} className="rounded object-none h-64 w-64 transform hover:scale-110 duration-200" />
        )
        return link ? (
          <Link href={link} passHref>
            <a target="_blank" rel="noreferrer">
              {image}
            </a>
          </Link>
        ) : (
          image
        )
      })}
    </div>
  )
}

export default CollectionsTable
