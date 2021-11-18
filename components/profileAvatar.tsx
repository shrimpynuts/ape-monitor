import React from 'react'
import Davatar from '@davatar/react'
import AddressPill from './addressPill'

interface IProps {
  address: string
  ensName: string
}

const ProfileAvatar = ({ address, ensName }: IProps) => (
  <div className="inline-block">
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
  </div>
)
export default ProfileAvatar
