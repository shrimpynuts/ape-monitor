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

function SaleEvent({ event, addressData }: IEventProps) {
  const isSeller = event.sellerAddress === addressData.address.toLowerCase()
  const counterParty = isSeller
    ? event.buyerUsername || middleEllipses(event.buyerAddress, 4, 5, 2)
    : event.sellerUsername || middleEllipses(event.sellerAddress, 4, 5, 2)

  const assetImage = (
    <div className="rounded">
      <Image src={event.asset.image_url || Placeholder} width={64} height={64} />
    </div>
  )

  return (
    <div className="flex space-x-4 items-center">
      <span className="text-sm w-24 text-right">
        <Moment fromNow>{event.date}</Moment>
      </span>
      {event.asset.link ? (
        <Link href={event.asset.link} passHref>
          <a target="_blank" rel="noreferrer">
            {assetImage}
          </a>
        </Link>
      ) : (
        assetImage
      )}
      <span>
        {isSeller ? 'Sold' : 'Bought'} {event.asset.name} {isSeller ? 'to' : 'from'} {counterParty} for{' '}
        <img className="inline" src="/eth-logo.svg" alt="eth logo" width="11" /> {event.price}
      </span>
    </div>
  )
}

function TransferEvent({ event, addressData }: IEventProps) {
  const isReceiver = event.toAddress === addressData.address.toLowerCase()
  const counterParty = isReceiver
    ? event.fromUsername || middleEllipses(event.fromAddress, 4, 5, 2)
    : event.toUsername || middleEllipses(event.toAddress, 4, 5, 2)

  const assetImage = (
    <div className="rounded">
      <Image src={event.asset.image_url || Placeholder} width={64} height={64} />
    </div>
  )

  const isMint = isReceiver && counterParty === 'NullAddress'

  return (
    <div className="flex space-x-4 items-center">
      <span className="text-sm w-24 text-right">
        <Moment fromNow>{event.date}</Moment>
      </span>
      {event.asset.link ? (
        <Link href={event.asset.link} passHref>
          <a target="_blank" rel="noreferrer">
            {assetImage}
          </a>
        </Link>
      ) : (
        assetImage
      )}
      <span>
        {isMint ? (
          'Minted ' + event.asset.name
        ) : (
          <>
            {isReceiver ? 'Received' : 'Sent'} {event.asset.name} {isReceiver ? 'from' : 'to'} {counterParty}
          </>
        )}
      </span>
    </div>
  )
}

function Activity({ tradeData, loading, addressData }: IProps) {
  return (
    <div className="">
      {tradeData?.events.map((event: IEvent) => {
        if (event.type === 'successful') return <SaleEvent event={event} addressData={addressData} />
        if (event.type === 'transfer') return <TransferEvent event={event} addressData={addressData} />
      })}
    </div>
  )
}

export default Activity
