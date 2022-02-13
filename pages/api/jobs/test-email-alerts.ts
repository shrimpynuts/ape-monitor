import type { NextApiRequest, NextApiResponse } from 'next'
import sgMail from '@sendgrid/mail'
import moment from 'moment'
import React from 'react'
import { renderEmail } from 'react-html-email'
import CollectionsUpdateEmail from '../../../components/email/template'

import { ICollectionsWithAssets } from '../../../frontend/types'
import { fetchAllCollections, groupAssetsWithCollections } from '../../../lib/util'
import { middleEllipses } from '../../../lib/util'

const sendgridAPIKey = process.env.SENDGRID_API_KEY
if (!sendgridAPIKey) {
  console.error("Couldn't fetch SENDGRID_API_KEY")
  process.exit(1)
}
sgMail.setApiKey(sendgridAPIKey)

async function getAlertData(server: string, address: string) {
  // Get user's assets
  const result = await fetch(`${server}/api/opensea/assets/${address}`).then((res) => res.json())
  const { assets, error } = result

  // Fetch all corresponding collections for the given assets
  const collections = await fetchAllCollections(server, assets)

  // Group the assets together with their collections

  const collectionsWithAssets: ICollectionsWithAssets = groupAssetsWithCollections(assets, collections)
  return collectionsWithAssets
}

async function createAlertMessage(
  server: string,
  toAddress: string,
  fromAddress: string,
  address: string,
  ensDomain?: string,
) {
  // const date = moment().format('MM/DD h:mma')
  const date = moment().format('MM/DD')
  const collectionsWithAssets = await getAlertData(server, address)

  const reactElement = React.createElement(CollectionsUpdateEmail, {
    title: 'this is alert text',
    collectionsWithAssets,
    address,
    ensDomain,
  })
  const emailHTML = renderEmail(reactElement)

  const msg = {
    to: toAddress,
    from: fromAddress,
    subject: `Ape Monitor Update - ${date} ${ensDomain ? ensDomain : middleEllipses(address, 4, 5, 2)}`,
    text: `and easy to do anywhere, even with Node.js ${address}`,
    html: `${emailHTML}`,
  }
  return msg
}

function getServer() {
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

async function getUsers(): Promise<IUser[]> {
  const johnny = {
    email: 'caimjonathan@gmail.com',
    address: '0xf725a0353dbB6aAd2a4692D49DDa0bE241f45fD0',
    ensDomain: 'jonathancai.eth',
  }
  return [johnny]
}

/**
 * Fetches the data for a single collection by its contract address from our database
 */
const request = async (req: NextApiRequest, res: NextApiResponse) => {
  const { key } = req.query

  // Verify the key for the request
  if (key !== process.env.SEND_EMAIL_KEY) {
    const error = 'Bad request: missing correct key parameter'
    console.error(error)
    return res.status(400).json({ error })
  }

  try {
    const users = await getUsers()

    // Construct all messages
    const messages = await Promise.all(
      users.map(({ email, address, ensDomain }) => {
        const fromAddress = 'jonathan@alias.co'
        const server = getServer()
        const messagePromise = createAlertMessage(server, email, fromAddress, address, ensDomain)
        return messagePromise
      }),
    )

    // Send all messages
    await Promise.all(messages.map((message) => sgMail.send(message)))

    return res.status(200).json({ success: true })
  } catch (error: any) {
    console.error(error)
    return res.status(400).json({ error })
  }
}

export default request
