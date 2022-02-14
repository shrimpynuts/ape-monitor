import sendgridMail from '@sendgrid/mail'
import moment from 'moment'
import React from 'react'
import { renderEmail } from 'react-html-email'

import { fetchAllCollections, groupAssetsWithCollections } from '../../lib/util'
import CollectionsUpdateEmail from '../../components/email/template'
import { ICollectionsWithAssets } from '../../frontend/types'
import client from '../../backend/graphql-client'
import { middleEllipses } from '../../lib/util'
import { GET_TOP_COLLECTIONS_ALERT } from '../../graphql/queries'

if (!process.env.SENDGRID_API_KEY) {
  console.error("Couldn't fetch SENDGRID_API_KEY")
  process.exit(1)
}
export const sendgridAPIKey = process.env.SENDGRID_API_KEY

export async function getTopCollections() {
  const { data } = await client.query({
    query: GET_TOP_COLLECTIONS_ALERT,
  })
  return data
}

export const removeDuplicatesSlug = (arr: any) => {
  return arr.reduce((arr: any, item: any) => {
    let exists = !!arr.find((x: any) => x.slug === item.slug)
    if (!exists) {
      arr.push(item)
    } else {
    }
    return arr
  }, [])
}

export async function getAlertData(server: string, address: string) {
  // Get user's assets
  const result = await fetch(`${server}/api/opensea/assets/${address}`).then((res) => res.json())
  const { assets, error } = result

  // Fetch all corresponding collections for the given assets
  const collections = await fetchAllCollections(server, assets)

  // Filter out zero floor/volume collections and duplicate collections
  const filteredCollections = collections.filter(
    (collection) =>
      collection.floor_price &&
      collection.total_volume &&
      collection.one_day_volume &&
      collection.floor_price > 0.009 &&
      collection.total_volume > 1 &&
      collection.one_day_volume > 1,
  )

  // Group the assets together with their collections
  const collectionsWithAssets: ICollectionsWithAssets = groupAssetsWithCollections(assets, filteredCollections)
  return collectionsWithAssets
}

export async function createAlertMessage(
  server: string,
  toAddress: string,
  fromAddress: string,
  fromName: string,
  address: string,
  ensDomain?: string,
) {
  const { totalVolume, trendingCollections } = await getTopCollections()

  const date = moment().format('MM/DD')
  const collectionsWithAssets = await getAlertData(server, address)

  const reactElement = React.createElement(CollectionsUpdateEmail, {
    title: `Ape Monitor Report Body`,
    collectionsWithAssets,
    topCollectionsByTotalVolume: removeDuplicatesSlug(totalVolume),
    topCollectionsByOneDayVolume: removeDuplicatesSlug(trendingCollections),
    address,
    ensDomain,
  })
  const emailHTML = renderEmail(reactElement)

  const msg = {
    to: toAddress,
    from: {
      email: fromAddress,
      name: fromName,
    },
    subject: `Ape Monitor Report ${date} - ${ensDomain ? ensDomain : middleEllipses(address, 4, 5, 2)}`,
    text: `and easy to do anywhere, even with Node.js ${address}`,
    html: `${emailHTML}`,
  }
  return msg
}

export function getServer() {
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000'
  } else if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  } else {
    console.error(`Failed to get server. 
    VERCEL_URL: ${process.env.VERCEL_URL}, NODE_ENV: ${process.env.NODE_ENV}, VERCEL_: ${process.env.VERCEL_} `)
    process.exit(1)
  }
}

interface IUser {
  email: string
  address: string
  ensDomain?: string
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const runAlerts = async (users: IUser[]) => {
  const fromAddress = 'jonathan@alias.co'
  const fromName = 'Jonathan Cai'
  const server = getServer()

  // Construct each email
  let emails = []
  for (const user of users) {
    const { email, address, ensDomain } = user
    try {
      // Wait 1 seconds to not bombard opensea server as much???
      await delay(5000)
      const message = await createAlertMessage(server, email, fromAddress, fromName, address, ensDomain)
      emails.push(message)
    } catch (error: any) {
      console.error(error)
    }
  }

  // Send emails
  const isMultiple = true
  await sendgridMail.send(emails, isMultiple)
}
