import type { NextApiRequest, NextApiResponse } from 'next'
import sgMail from '@sendgrid/mail'

import { sendgridAPIKey, createAlertMessage, getServer } from '../../../lib/alerts/util'

sgMail.setApiKey(sendgridAPIKey)

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
  const faraaz = {
    // email: 'faraaznishtar@gmail.com',
    email: 'caimjonathan@gmail.com',
    address: '0xd6CB70a88bB0D8fB1be377bD3E48e603528AdB54',
    ensDomain: 'faraaz.eth',
  }
  const rahul = {
    // email: 'rahulushah@gmail.com',
    email: 'caimjonathan@gmail.com',
    address: '0x87b3c0057e8A82b14c3BeF2914FCE915Fe1F4c01',
  }
  return [johnny, faraaz, rahul]
}

export const runAlerts = async (users: IUser[]) => {
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
    await runAlerts(users)
    return res.status(200).json({ success: true })
  } catch (error: any) {
    console.error(error)
    return res.status(400).json({ error })
  }
}

export default request
