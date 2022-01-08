import Image from 'next/image'
import Link from 'next/link'

import { getAllAssetsFromCollections } from '../lib/opensea/collections'
import { ICollectionsWithAssets, IAsset } from '../frontend/types'
import Placeholder from '../public/placeholder.jpeg'

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
          <Image
            src={image_url || Placeholder}
            width={180}
            height={180}
            className="rounded object-none h-64 w-64 transform hover:scale-110 duration-200 hover:shadow-xl"
          />
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
