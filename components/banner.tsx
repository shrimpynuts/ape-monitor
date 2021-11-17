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
      <div className="flex flex-col text-center px-16 text-gray-700 dark:text-lightblue">
        <span
          className={classnames('font-xl font-normal text-4xl', {
            'text-red-600 dark:text-lightred': performanceIndicator == 'negative',
            'text-green-600 dark:text-lightgreen': performanceIndicator == 'positive',
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
      <div className="vertical-spacer bg-gray-300 dark:bg-darkblue">
        <style jsx>{`
          .vertical-spacer {
            width: 1px;
            height: 35px;
          }
        `}</style>
      </div>
    )
  }

  const charge = oneDayChange > 0 ? '+' : ''
  return (
    <div className="flex items-center rounded-xl bg-white dark:bg-blackPearl border border-solid border-gray-200 dark:border-darkblue py-4 drop-shadow-md">
      <div className="flex items-center">
        <BannerDisplay amount={`${totalValue} Ξ`} subtext="total value" />
        <VerticalSpacer />
        <BannerDisplay amount={`${costBasis} Ξ`} subtext="cost basis" />
        <VerticalSpacer />
        <BannerDisplay
          amount={`${charge}${oneDayChange}%`}
          subtext="performance"
          performanceIndicator={oneDayChange > 0 ? 'positive' : 'negative'}
        />
      </div>
    </div>
  )
}
export default Banner
