import type { NextApiRequest, NextApiResponse } from 'next'
import sgMail from '@sendgrid/mail'

import { sendgridAPIKey, createAlertMessage, getServer, runAlerts } from '../../../lib/alerts/util'

sgMail.setApiKey(sendgridAPIKey)

interface IUser {
  email: string
  address: string
  ensDomain?: string
}

const adminUsers = [
  {
    email: 'caimjonathan@gmail.com',
    address: '0xf725a0353dbB6aAd2a4692D49DDa0bE241f45fD0',
    ensDomain: 'jonathancai.eth',
  },
  {
    email: 'faraaznishtar@gmail.com',
    // email: 'caimjonathan@gmail.com',
    address: '0xd6CB70a88bB0D8fB1be377bD3E48e603528AdB54',
    ensDomain: 'faraaz.eth',
  },
]

const users: IUser[] = [
  ...adminUsers,
  {
    email: 'rahulushah@gmail.com',
    address: '0x87b3c0057e8A82b14c3BeF2914FCE915Fe1F4c01',
  },
  {
    email: 'denizhanyigitbas@gmail.com',
    address: '0xf6A9D33736ad454391c8Afd76B29F0eF50557355',
  },
  {
    email: 'Jake@nyqu.ist',
    address: '0x578862011077c1cd95969452bd528b3ffd496d6C',
    ensDomain: 'Nyquist.eth',
  },
  {
    email: 'kenan.h.saleh@gmail.com',
    address: '0x47B151D5fd0a023B839d5d65a2F13027B1F15DAD',
    ensDomain: 'ksaleh.eth',
  },
  {
    email: 'ksrai99@gmail.com',
    address: '0x403dbA6a7bb1643656F9b06e5066523aFEe85eFc',
    ensDomain: 'kunalrai.eth',
  },
  {
    email: 'reyes.mikaelahelene@gmail.com',
    address: '0xC581207D2e6AC5025aD03fd38e73D4Bef1EB682a',
  },
  {
    email: 'yash@chapterone.com',
    address: '0x4d9a61cC5332C58929f173eE2913ff92fB076FFF',
    ensDomain: 'yashbora.eth',
  },
]

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
    await runAlerts(users)
    return res.status(200).json({ success: true })
  } catch (error: any) {
    console.error(error)
    return res.status(400).json({ error })
  }
}

export default request
