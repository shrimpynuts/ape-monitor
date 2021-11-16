import Davatar from '@davatar/react'
import Link from 'next/link'

interface IProps {
  address: string
  balance: string
  ensName: string | null
  href: string
  isAvatarHidden?: boolean
  isBalanceHidden?: boolean
}

const AddressPill: React.FC<IProps> = ({
  address,
  balance,
  ensName,
  isAvatarHidden = false,
  isBalanceHidden = false,
  href,
}) => {
  const splitAddress = address?.substr(0, 6) + `....` + address?.substr(address.length - 5, address.length - 1)

  return (
    <div className="inline-flex items-center text-black bg-gray-100 rounded-full border border-solid border-gray-200 dark:text-gray-100 dark:bg-blackPearl dark:border-darkblue">
      {!isBalanceHidden && (
        <div className="px-2 md:px-3 py-0 md:py-1 text-xs md:text-sm whitespace-nowrap overflow-hidden overflow-ellipsis	 font-medium">
          {balance} ETH
        </div>
      )}
      <Link passHref={false} href={href}>
        <a
          className="pl-2 md:px-2 py-1 flex items-center text-xs md:text-sm font-medium bg-white text-black rounded-full border-l border-solid border-gray-200 
      dark:text-gray-100 dark:bg-blackPearl dark:border-darkblue"
        >
          {ensName !== null ? ensName : splitAddress}
          {!isAvatarHidden && (
            <div className="md:ml-2 md:-mx-1">
              <Davatar
                size={20}
                address={address}
                generatedAvatarType="jazzicon" // optional, 'jazzicon' or 'blockies'
              />
            </div>
          )}
        </a>
      </Link>
    </div>
  )
}

export default AddressPill
