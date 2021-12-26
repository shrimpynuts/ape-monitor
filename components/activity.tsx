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
  image: React.ReactNode
}

function Event({ bodyText, date, image }: ISingleEventProps) {
  return (
    <div>
      <span className="text-xs">
        <Moment fromNow>{date}</Moment>
      </span>
      <div className="mt-2 flex space-x-4 justify-between md:justify-start md:items-center">
        <span className="text-sm w-24 grow-0 text-right md:text-right">
          <div className="inline">{image}</div>
        </span>
        <span className="text-sm text-right">{bodyText}</span>
      </div>
    </div>
  )
}

function SaleEvent({ event, addressData }: IEventProps) {
  const isSeller = event.sellerAddress === addressData.address.toLowerCase()
  const counterParty = isSeller
    ? event.buyerUsername || middleEllipses(event.buyerAddress, 4, 5, 2)
    : event.sellerUsername || middleEllipses(event.sellerAddress, 4, 5, 2)

  const assetImage = (
    <div className="rounded">
      <Image src={event.asset.image_url || Placeholder} width={96} height={96} />
    </div>
  )

  const image = event.asset.link ? (
    <Link href={event.asset.link} passHref>
      <a target="_blank" rel="noreferrer">
        {assetImage}
      </a>
    </Link>
  ) : (
    assetImage
  )

  const text = `${isSeller ? 'Sold' : 'Bought'} ${event.asset.name} ${isSeller ? 'to' : 'from'} ${counterParty} for ${
    event.price
  }Ξ`
  return <Event date={event.date} bodyText={text} image={image} />
}

function TransferEvent({ event, addressData }: IEventProps) {
  const isReceiver = event.toAddress === addressData.address.toLowerCase()
  const counterParty = isReceiver
    ? event.fromUsername || middleEllipses(event.fromAddress, 4, 5, 2)
    : event.toUsername || middleEllipses(event.toAddress, 4, 5, 2)

  const assetImage = (
    <div className="rounded">
      <Image src={event.asset.image_url || Placeholder} width={96} height={96} />
    </div>
  )
  const isMint = isReceiver && counterParty === 'NullAddress'
  const image = event.asset.link ? (
    <Link href={event.asset.link} passHref>
      <a target="_blank" rel="noreferrer">
        {assetImage}
      </a>
    </Link>
  ) : (
    assetImage
  )
  const text = isMint
    ? `Minted ${event.asset.name}`
    : `${isReceiver ? 'Received' : 'Sent'} ${event.asset.name} ${isReceiver ? 'from' : 'to'} ${counterParty}`

  return <Event date={event.date} bodyText={text} image={image} />
}

function Activity({ tradeData, loading, addressData }: IProps) {
  return (
    <div className="flex flex-col space-y-4 md:space-y-2">
      {tradeData?.events.map((event: IEvent) => {
        if (event.type === 'successful') return <SaleEvent event={event} addressData={addressData} />
        if (event.type === 'transfer') return <TransferEvent event={event} addressData={addressData} />
      })}
    </div>
  )
}

export default Activity
