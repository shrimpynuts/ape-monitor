import React from 'react'
import Davatar from '@davatar/react'
import useClipboard from 'react-use-clipboard'

import AddressPill from '../util/addressPill'
import { middleEllipses } from '../../lib/util'
import { ClipboardIcon, ClipboardCheckIcon } from '@heroicons/react/outline'

interface IProps {
  address: string
  ensName: string
}

const ProfileAvatar = ({ address, ensName }: IProps) => {
  const [isCopied, setCopied] = useClipboard(address, { successDuration: 1000 })

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-center rounded-full">
        <Davatar
          key={address}
          size={80}
          address={address}
          generatedAvatarType="jazzicon" // optional, 'jazzicon' or 'blockies'
        />
      </div>
      <div className="-mt-2 md:mt-2 mb-2 md:mb-0">
        <AddressPill
          isBalanceHidden
          isAvatarHidden
          ensName={ensName}
          balance="0.0"
          address={address}
          href={`/${ensName}`}
        />
      </div>
      <div className="-mt-1 md:mt-1 flex space-x-1 items-center">
        <span className="dark:text-gray-300">{middleEllipses(address, 4, 5, 2)}</span>
        <div className="p-2 hover:bg-gray-100 hover:dark:bg-gray-800 rounded-full cursor-pointer" onClick={setCopied}>
          {isCopied ? <ClipboardCheckIcon className="h-4 w-4" /> : <ClipboardIcon className="h-4 w-4" />}
        </div>
      </div>
    </div>
  )
}
export default ProfileAvatar
