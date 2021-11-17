import React from 'react'
import ProfileAvatar from './profileAvatar'
import Banner from './banner'

interface IProps {
  address: string
  costBasis: any
  totalValue: any
  oneDayChange: any
  ensName: string
}

const ProfileBanner = ({ address, costBasis, totalValue, oneDayChange, ensName }: IProps) => {
  return (
    <div className="flex flex-col md:flex-row md:justify-center items-center md:space-x-8">
      <ProfileAvatar address={address} ensName={ensName} />
      <div>
        <Banner costBasis={costBasis} totalValue={totalValue} oneDayChange={oneDayChange} />
      </div>
    </div>
  )
}
export default ProfileBanner
