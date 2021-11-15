import Davatar from '@davatar/react'

import { ITotalStats, IAddressData } from '../pages/[address]'
import { middleEllipses, fixedNumber } from '../lib/util'
import DeltaDisplay from '../components/deltaDisplay'
import useWeb3Container from '../hooks/useWeb3User'
import Tooltip from '../components/tooltip'

interface IProps {
  totalStats: ITotalStats
  addressData: IAddressData
  loading: boolean
}

const ProfileDetails: React.FC<IProps> = ({
  loading,
  totalStats: { oneDayChange, value, assetsOwned, costBasis },
  addressData: { ensDomain, address },
}) => {
  const { ethPrice } = useWeb3Container.useContainer()

  return (
    <div
      className="flex flex-col px-2 py-4 space-y-2 md:space-y-0 mx-4 shadow sm:rounded-lg bg-gray-100 dark:bg-gray-850 text-gray-500 dark:text-gray-100
      md:flex-row md:items-center md:divide-x-2 divide-gray-200 dark:divide-gray-700"
    >
      {/* Avatar and name */}
      <div className="flex text-lg font-bold px-1 md:px-4 space-x-2 items-center border-b-2 md:border-b-0 border-gray-200 dark:border-gray-700 py-2 md:py-0">
        <Davatar
          size={20}
          address={address}
          generatedAvatarType="jazzicon" // optional, 'jazzicon' or 'blockies'
        />
        <h4 className="text-xl lowercase ">{ensDomain ? ensDomain : middleEllipses(address, 4, 6, 4)}</h4>
      </div>

      {!loading && (
        <>
          {/* # of NFTs */}
          <h4 className="text-sm px-1 md:px-4 ">{assetsOwned} NFTs</h4>
          {/* Total Value */}
          <h4 className="text-sm px-1 space-between md:px-4 relative flex space-x-2 items-center ">
            <div className="flex-none">
              <Tooltip text="Based on floor prices, discounting rarity" />
            </div>
            <div className="flex space-x-2 items-center flex-grow">
              Total Value: {fixedNumber(value)}Ξ &nbsp; {ethPrice && <div>(${fixedNumber(ethPrice * value, 0)}) </div>}
              <DeltaDisplay delta={oneDayChange} denomination="%" />
            </div>
          </h4>
          {/* Total Cost Basis */}
          <h4 className="text-sm px-1 space-between md:px-4 relative flex space-x-2 items-center ">
            <Tooltip text="May be inaccurate due to mint costs" />
            <div className="flex space-x-2 items-center flex-grow">
              <span>Total Cost Basis: {fixedNumber(costBasis)}Ξ &nbsp; </span>
              {ethPrice && <div>(${fixedNumber(costBasis * ethPrice, 0)}) </div>}
            </div>
          </h4>
          {/* Price of Ethereum (if available) */}
          {ethPrice && <h4 className="hidden md:block text-sm px-1 md:px-4">ETH Price: ${ethPrice}</h4>}
        </>
      )}
    </div>
  )
}

export default ProfileDetails
