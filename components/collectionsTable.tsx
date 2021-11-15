import { useState, useMemo } from 'react'
import { CellProps } from 'react-table'
import { LinkIcon, ExternalLinkIcon } from '@heroicons/react/solid'
import useMobileDetect from 'use-mobile-detect-hook'

import { fixedNumber, getCostBasis } from '../lib/util'
import DeltaDisplay from './deltaDisplay'
import Table from './table'

/**
 * The possible timespans for opensea price delta data
 */
const timespans = [
  { value: '24h', dataPrefix: 'one_day', display: '24hr' },
  { value: '7d', dataPrefix: 'seven_day', display: '7 Day' },
  { value: '30d', dataPrefix: 'thirty_day', display: '30 Day' },
]

function CollectionsTable({ collections }: { collections: any[] }) {
  // Detect if window is mobile
  const detectMobile = useMobileDetect()
  const isMobile = detectMobile.isMobile()
  const [currentTimespan, setCurrentTimespan] = useState(timespans[0])

  const columns = useMemo(
    () => [
      {
        Header: `Collections (${collections.length})`,
        columns: [
          {
            Header: 'Name',
            accessor: 'name',
            width: isMobile ? 200 : 300,
            Cell: ({ cell: { value, row } }: CellProps<any>) => (
              <div className="flex space-x-2 overflow-ellipsis">
                <img src={row.original.image_url} className="h-8 w-8 rounded" />
                <span className="overflow-ellipsis overflow-hidden">{value}</span>
              </div>
            ),
          },
          {
            Header: isMobile ? '#' : '# Owned',
            accessor: 'assets.length',
            width: isMobile ? '20' : 80,
            disableFilters: true,
          },
          {
            Header: 'Links',
            accessor: 'slug',
            Cell: ({ cell: { value, row } }: CellProps<any>) => (
              <div className="flex space-x-2 items-center h-full">
                <a href={`https://opensea.io/collection/${value}`} target="_blank" rel="noreferrer">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M7 0C3.1346 0 0 3.1346 0 7C0 10.8654 3.1346 14 7 14C10.8654 14 14 10.8654 14 7C14 3.1346 10.8668 0 7 0ZM3.4538 7.2352L3.4832 7.1876L5.3046 4.3386C5.3312 4.298 5.3942 4.3022 5.4138 4.347C5.7176 5.0288 5.9808 5.8772 5.8576 6.405C5.8058 6.622 5.6616 6.916 5.4992 7.1876C5.4782 7.2268 5.4558 7.266 5.4306 7.3038C5.4194 7.3206 5.3998 7.3304 5.3788 7.3304H3.507C3.4566 7.3304 3.4272 7.2758 3.4538 7.2352ZM11.5696 8.2152C11.5696 8.2418 11.5542 8.2642 11.5318 8.274C11.3904 8.3342 10.9074 8.5568 10.7072 8.8354C10.1948 9.548 9.8042 10.5672 8.9292 10.5672H5.2808C3.9872 10.5672 2.94 9.5158 2.94 8.218V8.176C2.94 8.1424 2.968 8.1144 3.003 8.1144H5.0358C5.0764 8.1144 5.1058 8.1508 5.103 8.1914C5.0876 8.323 5.1128 8.4588 5.1758 8.582C5.2962 8.827 5.5468 8.9796 5.817 8.9796H6.8236V8.1942H5.8282C5.7778 8.1942 5.747 8.1354 5.7764 8.0934C5.7876 8.0766 5.7988 8.0598 5.8128 8.0402C5.9066 7.9058 6.041 7.6986 6.1754 7.462C6.2664 7.3024 6.3546 7.1316 6.426 6.9608C6.44 6.93 6.4512 6.8978 6.4638 6.867C6.4834 6.8124 6.503 6.7606 6.517 6.7102C6.531 6.6668 6.5436 6.622 6.5548 6.58C6.5884 6.4344 6.6024 6.2804 6.6024 6.1208C6.6024 6.0578 6.5996 5.992 6.594 5.9304C6.5912 5.8618 6.5828 5.7932 6.5744 5.7246C6.5688 5.6644 6.5576 5.6042 6.5464 5.5426C6.531 5.4516 6.5114 5.3606 6.489 5.2696L6.4806 5.2346C6.4638 5.1716 6.4484 5.1128 6.4288 5.0498C6.3714 4.8538 6.307 4.662 6.237 4.4828C6.2118 4.4114 6.1838 4.3428 6.1544 4.2756C6.1124 4.172 6.069 4.0782 6.0298 3.99C6.0088 3.9494 5.992 3.913 5.9752 3.8752C5.9556 3.8332 5.936 3.7912 5.915 3.7506C5.901 3.7198 5.8842 3.6904 5.873 3.6624L5.7498 3.4356C5.733 3.4048 5.761 3.367 5.7946 3.3768L6.5646 3.5854H6.5674C6.5688 3.5854 6.5688 3.5854 6.5702 3.5854L6.671 3.6148L6.783 3.6456L6.8236 3.6568V3.2004C6.8236 2.9792 7 2.8 7.2198 2.8C7.329 2.8 7.4284 2.8448 7.4984 2.9176C7.5698 2.9904 7.6146 3.0898 7.6146 3.2004V3.8794L7.6972 3.9018C7.7028 3.9046 7.7098 3.9074 7.7154 3.9116C7.735 3.9256 7.7644 3.948 7.8008 3.976C7.8302 3.9984 7.861 4.0264 7.8974 4.0558C7.9716 4.116 8.0612 4.193 8.1578 4.2812C8.183 4.3036 8.2082 4.326 8.232 4.3498C8.3566 4.466 8.4966 4.6018 8.631 4.753C8.6688 4.7964 8.7052 4.8384 8.743 4.8846C8.7794 4.9308 8.82 4.9756 8.8536 5.0204C8.8998 5.0806 8.9474 5.1436 8.9908 5.2094C9.0104 5.2402 9.0342 5.2724 9.0524 5.3032C9.1084 5.3858 9.156 5.4712 9.2022 5.5566C9.2218 5.5958 9.2414 5.6392 9.2582 5.6812C9.31 5.796 9.3506 5.9122 9.3758 6.0298C9.3842 6.055 9.3898 6.0816 9.3926 6.1068V6.1124C9.401 6.146 9.4038 6.1824 9.4066 6.2202C9.4178 6.3392 9.4122 6.4596 9.387 6.58C9.3758 6.6304 9.3618 6.678 9.345 6.7298C9.3268 6.7788 9.31 6.8292 9.2876 6.8782C9.2442 6.9776 9.1938 7.0784 9.1336 7.1708C9.114 7.2058 9.0902 7.2422 9.0678 7.2772C9.0426 7.3136 9.016 7.3486 8.9936 7.3822C8.9614 7.4256 8.9278 7.4704 8.8928 7.511C8.862 7.553 8.8312 7.595 8.7962 7.6328C8.7486 7.6902 8.7024 7.7434 8.6534 7.7952C8.6254 7.8288 8.5946 7.8638 8.5624 7.8946C8.5316 7.9296 8.4994 7.9604 8.4714 7.9884C8.4224 8.0374 8.3832 8.0738 8.3496 8.106L8.2698 8.1774C8.2586 8.1886 8.2432 8.1942 8.2278 8.1942H7.6146V8.9796H8.386C8.5582 8.9796 8.722 8.9194 8.855 8.806C8.8998 8.7668 9.0972 8.596 9.331 8.3384C9.3394 8.3286 9.3492 8.323 9.3604 8.3202L11.4898 7.7042C11.5304 7.693 11.5696 7.7224 11.5696 7.7644V8.2152Z"
                      className="fill-current"
                    />
                  </svg>
                </a>
                {row.original.external_url && (
                  <a href={row.original.external_url} target="_blank" rel="noreferrer">
                    <LinkIcon className="h-4 w-4" />
                  </a>
                )}
                {row.original.twitter_username && (
                  <a href={`https://twitter.com/${row.original.twitter_username}`} target="_blank" rel="noreferrer">
                    <svg width="17" height="14" viewBox="0 0 17 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M16.3333 1.65739C15.726 1.93846 15.0787 2.12478 14.404 2.21524C15.0981 1.778 15.628 1.09092 15.877 0.262775C15.2299 0.66985 14.5152 0.957387 13.7537 1.11785C13.1392 0.427551 12.2633 0 11.3078 0C9.45396 0 7.96147 1.58739 7.96147 3.53337C7.96147 3.81337 7.98396 4.08263 8.03911 4.33887C5.25523 4.19576 2.79198 2.78812 1.13721 0.644001C0.848315 1.17278 0.678859 1.778 0.678859 2.42955C0.678859 3.65287 1.27604 4.73737 2.16621 5.36525C1.62823 5.3545 1.10046 5.18976 0.653333 4.93012C0.653333 4.94087 0.653333 4.95487 0.653333 4.96887C0.653333 6.6855 1.81402 8.11137 3.33609 8.43988C3.06353 8.5185 2.76646 8.55612 2.45817 8.55612C2.24379 8.55612 2.02737 8.54325 1.82423 8.49588C2.25809 9.89475 3.48921 10.9233 4.95303 10.9566C3.8138 11.8967 2.36732 12.4633 0.801352 12.4633C0.526754 12.4633 0.26337 12.4504 0 12.4147C1.48326 13.4239 3.24114 14 5.13687 14C11.2986 14 14.6673 8.61537 14.6673 3.948C14.6673 3.79188 14.6622 3.64113 14.655 3.49137C15.3197 2.99388 15.878 2.37246 16.3333 1.65739Z"
                        fill="#0B99EC"
                      />
                    </svg>
                  </a>
                )}
                {row.original.discord_url && (
                  <a href={row.original.discord_url} target="_blank" rel="noreferrer">
                    <svg width="19" height="14" viewBox="0 0 19 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M15.6583 1.16052C14.4794 0.623368 13.2151 0.227615 11.8933 0.000950826C11.8693 -0.00342372 11.8452 0.00750851 11.8328 0.0293735C11.6702 0.316529 11.4901 0.691146 11.364 0.985594C9.94231 0.774239 8.52791 0.774239 7.13537 0.985594C7.00923 0.684601 6.82259 0.316529 6.65927 0.0293735C6.64687 0.00823803 6.62283 -0.0026942 6.59875 0.000950826C5.27767 0.226891 4.01346 0.622643 2.83381 1.16052C2.82359 1.1649 2.81484 1.17219 2.80903 1.18166C0.411084 4.73909 -0.245814 8.20908 0.0764379 11.636C0.077896 11.6528 0.0873739 11.6688 0.100497 11.679C1.68259 12.8328 3.21513 13.5332 4.7192 13.9974C4.74327 14.0047 4.76877 13.996 4.78409 13.9763C5.13988 13.4938 5.45704 12.9851 5.72896 12.4501C5.74501 12.4188 5.72969 12.3816 5.69689 12.3692C5.19383 12.1797 4.71482 11.9487 4.25404 11.6863C4.2176 11.6652 4.21468 11.6134 4.24821 11.5887C4.34517 11.5165 4.44216 11.4414 4.53475 11.3656C4.5515 11.3518 4.57484 11.3489 4.59454 11.3576C7.62165 12.73 10.8989 12.73 13.8903 11.3576C13.9099 11.3481 13.9333 11.3511 13.9508 11.3649C14.0434 11.4407 14.1403 11.5165 14.238 11.5887C14.2716 11.6134 14.2694 11.6652 14.2329 11.6863C13.7722 11.9538 13.2931 12.1797 12.7894 12.3685C12.7566 12.3809 12.742 12.4188 12.758 12.4501C13.0358 12.9844 13.3529 13.4931 13.7022 13.9756C13.7167 13.996 13.743 14.0047 13.7671 13.9974C15.2784 13.5332 16.8109 12.8328 18.393 11.679C18.4069 11.6688 18.4156 11.6535 18.4171 11.6368C18.8028 7.67482 17.7711 4.23329 15.6823 1.18238C15.6772 1.17219 15.6685 1.1649 15.6583 1.16052ZM6.18101 9.54938C5.26965 9.54938 4.5187 8.71853 4.5187 7.69815C4.5187 6.67778 5.25508 5.84693 6.18101 5.84693C7.11421 5.84693 7.85789 6.68508 7.8433 7.69815C7.8433 8.71853 7.10692 9.54938 6.18101 9.54938ZM12.3271 9.54938C11.4158 9.54938 10.6648 8.71853 10.6648 7.69815C10.6648 6.67778 11.4012 5.84693 12.3271 5.84693C13.2603 5.84693 14.004 6.68508 13.9894 7.69815C13.9894 8.71853 13.2603 9.54938 12.3271 9.54938Z"
                        fill="#5865F2"
                      />
                    </svg>
                  </a>
                )}
              </div>
            ),
            disableFilters: true,
            width: 150,
          },
        ],
      },
      {
        Header: 'Stats',
        columns: [
          {
            Header: `Floor Price (with ${currentTimespan.display} Change)`,
            accessor: 'stats',
            id: 'floor_price',
            Cell: ({ cell: { value } }: CellProps<any>) => (
              <div className="flex items-center space-x-2">
                {value ? (
                  <>
                    <span>{fixedNumber(value.floor_price)}Ξ</span>
                    {value[`${currentTimespan.dataPrefix}_change`] > 0 && (
                      <DeltaDisplay delta={value[`${currentTimespan.dataPrefix}_change`]} denomination="%" />
                    )}
                  </>
                ) : (
                  ''
                )}
              </div>
            ),
            disableFilters: true,
            width: 170,
          },
          {
            Header: `Volume (with ${currentTimespan.display} Volume)`,
            accessor: 'stats',
            id: 'Volume',
            Cell: ({ cell: { value } }: CellProps<any>) => (
              <div className="flex items-center space-x-2">
                {value ? (
                  <>
                    <span>{fixedNumber(value.total_volume)}Ξ</span>
                    {value[`${currentTimespan.dataPrefix}_volume`] > 0 && (
                      <span className="text-green-600">
                        +{fixedNumber(value[`${currentTimespan.dataPrefix}_volume`])}Ξ
                      </span>
                    )}
                  </>
                ) : (
                  ''
                )}
              </div>
            ),
            disableFilters: true,
            width: 170,
          },
          {
            Header: `Cost Basis`,
            accessor: 'assets',
            Cell: ({ cell: { row } }: CellProps<any>) => {
              const costBasis = getCostBasis(row.original)
              return (
                <div className="flex items-center justify-between space-x-2">
                  <span>{`${fixedNumber(costBasis.total)} ${costBasis.symbol}`}</span>
                </div>
              )
            },
            disableFilters: true,
            width: 200,
          },
        ],
      },
      {
        Header: 'Other',
        columns: [
          {
            Header: 'Activity',
            accessor: 'slug',
            id: 'activity',
            width: 20,
            Cell: ({ cell: { value } }: CellProps<object>) => (
              <a href={`https://opensea.io/collection/${value}?tab=activity`} target="_blank" rel="noreferrer">
                <ExternalLinkIcon className="h-4 w-4" />
              </a>
            ),
            disableFilters: true,
          },
        ],
      },
    ],
    [currentTimespan, isMobile],
  )

  /**
   * Allows the user to switch between the different available timespans
   */
  const TimespanSwitch = () => (
    <div
      className="flex my-2 shadow divide-x divide-gray-200 dark:divide-gray-700 rounded 
    dark:bg-gray-800 w-min text-gray-500 dark:text-gray-100 "
    >
      {timespans.map((timespan, i) => {
        const { value } = timespan
        return (
          <button
            key={i}
            className={`cursor-pointer px-4 hover:bg-gray-50 dark:hover:bg-gray-700 
            ${currentTimespan.value === value && 'bg-gray-100 dark:bg-gray-600'}
            ${i === 0 && 'rounded-l'}
            ${i === timespans.length - 1 && 'rounded-r'}
            `}
            onClick={() => setCurrentTimespan(timespan)}
          >
            <span>{value}</span>
          </button>
        )
      })}
    </div>
  )

  return (
    <div className="w-full">
      <TimespanSwitch />
      <Table columns={columns} data={collections} isMobile={isMobile} />
    </div>
  )
}

export default CollectionsTable
