import React from 'react'
import classnames from 'classnames'

interface IProps {
  costBasis: any
  totalValue: any
  oneDayChange: any
}

const Banner = ({ costBasis, totalValue, oneDayChange }: IProps) => {
  interface ItemProps {
    subtext: string
    amount: string
    performanceIndicator?: 'positive' | 'negative' | 'neutral'
  }
  const BannerDisplay = ({ subtext, amount, performanceIndicator = 'neutral' }: ItemProps) => {
    return (
      <div className="flex flex-col text-center px-16 text-lightblue">
        <span
          className={classnames('font-xl font-normal text-4xl', {
            ' text-lightred': performanceIndicator == 'negative',
            ' text-lightgreen': performanceIndicator == 'positive',
          })}
        >
          {amount}
        </span>
        <span className={classnames('uppercase mt-1 text-xs tracking-wider')}>{subtext}</span>
      </div>
    )
  }
  const VerticalSpacer = () => {
    return (
      <div className="vertical-spacer bg-darkblue">
        <style jsx>{`
          .vertical-spacer {
            width: 1px;
            height: 35px;
          }
        `}</style>
      </div>
    )
  }
  return (
    <div className="flex items-center rounded-xl bg-blackPearl border border-solid border-darkblue py-4">
      <div className="flex items-center">
        <BannerDisplay amount={`${totalValue} Ξ`} subtext="total value" />
        <VerticalSpacer />
        <BannerDisplay amount={`${costBasis} Ξ`} subtext="cost basis" />
        <VerticalSpacer />
        <BannerDisplay amount={`+${oneDayChange}%`} subtext="performance" performanceIndicator="positive" />
      </div>
    </div>
  )
}
export default Banner
