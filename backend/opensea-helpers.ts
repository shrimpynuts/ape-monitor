import { ICollection } from '../frontend/types'

export const fetchOpenseaCollectionFromContractAddress = async (
  contractAddress: string,
): Promise<Omit<ICollection, 'created_at' | 'updated_at' | 'is_stats_fetched'>> => {
  const url = `https://api.opensea.io/api/v1/asset_contract/${contractAddress}`
  console.log(`   Making Opensea API Call: ${url}`)
  const result = await fetch(url).then((res) => res.json())
  const { collection, detail } = result

  // This means request was throttled
  if (detail) {
    console.error(`Request for opensea asset_contract ${contractAddress}: ${detail}`)
    throw new Error(detail)
  }

  const prunedCollection = {
    contract_address: contractAddress,
    name: collection.name,
    slug: collection.slug,
    image_url: collection.image_url,
    twitter_username: collection.twitter_username,
    discord_url: collection.discord_url,
    external_url: collection.external_url,
  }
  return prunedCollection
}

interface IFetchOpenSeaCollectionsProps {
  offset?: number
  limit?: number
}
export const fetchOpenSeaCollections = async ({
  offset = 0,
  limit = 300,
}: IFetchOpenSeaCollectionsProps): Promise<{ collections: Array<ICollection> }> => {
  console.log(`Calling offset ${offset}`)
  const result = await fetch(`https://api.opensea.io/api/v1/collections?offset=${offset}&limit=${limit}`).then((res) =>
    res.json(),
  )

  // This means request was throttled
  // if (detail) {
  //   console.error(`Request for opensea asset_contract: ${detail}`)
  //   throw new Error(detail)
  // }

  return result
}
