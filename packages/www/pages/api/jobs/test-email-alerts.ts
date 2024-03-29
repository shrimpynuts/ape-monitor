import type { NextApiRequest, NextApiResponse } from 'next'
import sgMail from '@sendgrid/mail'

import { sendgridAPIKey, runAlerts } from '../../../lib/alerts/util'

sgMail.setApiKey(sendgridAPIKey)

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
    const johnny = {
      email: 'caimjonathan@gmail.com',
      address: '0xf725a0353dbB6aAd2a4692D49DDa0bE241f45fD0',
      ensDomain: 'jonathancai.eth',
    }

    const users = [johnny]
    await runAlerts(users)
    return res.status(200).json({ success: true })
  } catch (error: any) {
    console.error(error)
    return res.status(400).json({ error })
  }
}

export default request
