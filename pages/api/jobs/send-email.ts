import type { NextApiRequest, NextApiResponse } from 'next'
import sgMail from '@sendgrid/mail'
import moment from 'moment'
import React from 'react'
import { renderEmail } from 'react-html-email'
import HtmlEmail from '../../../components/email/template'

const sendgridAPIKey = process.env.SENDGRID_API_KEY
if (!sendgridAPIKey) {
  console.error("Couldn't fetch SENDGRID_API_KEY")
  process.exit(1)
}
sgMail.setApiKey(sendgridAPIKey)

function createMessage(toAddress: string, fromAddress: string, ethAddress: string) {
  const date = moment().format('MM/DD h:mma')

  const reactElement = React.createElement(HtmlEmail, { title: 'hello' })
  const emailHTML = renderEmail(reactElement)

  const msg = {
    to: toAddress,
    from: fromAddress,
    subject: `Ape Monitor Update - ${date}`,
    text: `and easy to do anywhere, even with Node.js ${ethAddress}`,
    html: `${emailHTML}`,
  }
  return msg
}

/**
 * Fetches the data for a single collection by its contract address from our database
 */
const request = async (req: NextApiRequest, res: NextApiResponse) => {
  const fromAddress = 'caimjonathan@gmail.com'
  const toAddress = 'jonathan@alias.co'
  const ethAddress = '0xf725a0353dbB6aAd2a4692D49DDa0bE241f45fD0'
  const msg = createMessage(fromAddress, toAddress, ethAddress)

  console.log({ msg })

  try {
    await sgMail.send(msg)
    return res.status(200).json({ success: true })
  } catch (error: any) {
    console.error(error)
    return res.status(400).json({ error, fromAddress })
  }
}

export default request
