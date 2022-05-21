import Image from 'next/image'
import Link from 'next/link'
import Moment from 'react-moment'

import { IAddressData, ITradeData, IEvent } from '../frontend/types'
import Placeholder from '../public/placeholder.jpeg'
import { middleEllipses } from '../lib/util'

interface IProps {
  tradeData: ITradeData | undefined
  loading: boolean
  addressData: IAddressData
}

interface IEventProps {
  addressData: IAddressData
  event: IEvent
}

interface ISingleEventProps {
  date: Date
  bodyText: string
  image?: string
  link?: string
  collectionName?: string
}

function Event({ bodyText, date, image, link, collectionName }: ISingleEventProps) {
  const event = (
    <div
      className="px-4 py-4 rounded shadow dark:hover:bg-gray-900 hover:bg-gray-50 cursor-pointer border 
      md:w-2/3
      text-gray-800 dark:text-gray-100
border-solid border-gray-100 dark:border-darkblue drop-shadow-md transform hover:translate-x-2 transition duration-300"
    >
      <div className="flex space-x-4 justify-between  md:items-center">
        <span className="text-sm w-24 grow-0 text-right md:text-right">
          <Image className="rounded-lg" src={image || Placeholder} width={96} height={96} />
        </span>
        <div className="flex flex-col space-y-2">
          <span className="text-right italic">
            <Moment fromNow>{date}</Moment>
          </span>
          <span className="font-semibold text-right">{bodyText}</span>
          <span className="text-right">{collectionName}</span>
        </div>
      </div>
    </div>
  )
  return link ? (
    <Link href={link} passHref>
      <a target="_blank" rel="noreferrer">
        {event}
      </a>
    </Link>
  ) : (
    event
  )
}

function SaleEvent({ event, addressData }: IEventProps) {
  const isSeller = event.sellerAddress === addressData.address.toLowerCase()
  const counterParty = isSeller
    ? event.buyerUsername || middleEllipses(event.buyerAddress, 4, 5, 2)
    : event.sellerUsername || middleEllipses(event.sellerAddress, 4, 5, 2)

  const text = `${isSeller ? 'Sold' : 'Bought'} ${event.asset.name} ${isSeller ? 'to' : 'from'} ${counterParty} for ${
    event.price
  }Ξ`
  return (
    <Event
      collectionName={event.collection.name}
      date={event.date}
      bodyText={text}
      image={event.asset.image_url}
      link={event.asset.link}
    />
  )
}

function TransferEvent({ event, addressData }: IEventProps) {
  const isReceiver = event.toAddress === addressData.address.toLowerCase()
  const counterParty = isReceiver
    ? event.fromUsername || middleEllipses(event.fromAddress, 4, 5, 2)
    : event.toUsername || middleEllipses(event.toAddress, 4, 5, 2)

  const isMint = isReceiver && counterParty === 'NullAddress'
  const text = isMint
    ? `Minted ${event.asset.name === null ? event.asset.token_id : event.asset.name}`
    : `${isReceiver ? 'Received' : 'Sent'} ${event.asset.name} ${isReceiver ? 'from' : 'to'} ${counterParty}`

  return (
    <Event
      collectionName={event.collection.name}
      date={event.date}
      bodyText={text}
      image={event.asset.image_url}
      link={event.asset.link}
    />
  )
}

function Activity({ tradeData, loading, addressData }: IProps) {
  return (
    <div className="flex flex-col space-y-4">
      {tradeData?.events.map((event: IEvent) => {
        if (event.type === 'successful') return <SaleEvent event={event} addressData={addressData} />
        if (event.type === 'transfer') return <TransferEvent event={event} addressData={addressData} />
      })}
    </div>
  )
}

export default Activity
