import { DuplicateIcon, ExternalLinkIcon } from '@heroicons/react/outline'
import { DuplicateIcon as DuplicateIconSolid } from '@heroicons/react/solid'
import useClipboard from 'react-use-clipboard'
import { useRouter } from 'next/router'
import Link from 'next/link'

import { ipfsURItoURL } from '../../lib/ethers/metadata'
import { ICollection, ITokenData } from '../../frontend/types'

function DisplayKeyValue({
  left,
  right,
  link,
  copy,
}: {
  left: string
  right: string | undefined
  link?: string
  copy?: boolean
}) {
  const [isCopied, setCopied] = useClipboard(right || '', { successDuration: 1000 })
  // useEffect(() => {
  //   if (isCopied) toast.success('Copied to clipboard!')
  // }, [isCopied])
  return (
    <div className="flex justify-between space-x-8 pt-2 overflow-x-hidden">
      <span>{left}:</span>
      <div className="flex items-center space-x-2">
        <span className="text-ellipsis line-clamp-3 hover:line-clamp-6">{right}</span>

        {link && (
          <div className="hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full cursor-pointer">
            <a href={link} target="_blank" rel="noreferrer">
              <ExternalLinkIcon className="h-4 w-4" />
            </a>
          </div>
        )}

        {copy && (
          <div className="hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full cursor-pointer" onClick={setCopied}>
            {isCopied ? <DuplicateIconSolid className="h-4 w-4" /> : <DuplicateIcon className="h-4 w-4" />}
          </div>
        )}
      </div>
    </div>
  )
}

function DisplayKeyValueData({ left, right }: { left: string; right: string }) {
  const [isCopied, setCopied] = useClipboard(right, { successDuration: 1000 })
  return (
    <div className="flex justify-between space-x-8 mt-2">
      <div>
        <span className="font-mono bg-gray-200 dark:bg-gray-800 p-1 rounded ">{left}:</span>
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-ellipsis line-clamp-3 hover:line-clamp-6">{right}</span>
        <div className="hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full cursor-pointer" onClick={setCopied}>
          {isCopied ? <DuplicateIconSolid className="h-4 w-4" /> : <DuplicateIcon className="h-4 w-4" />}
        </div>
      </div>
    </div>
  )
}

interface IProps {
  tokenData?: ITokenData
  collection?: ICollection
}

const Token = ({ tokenData, collection }: IProps) => {
  const router = useRouter()
  const { contract_address, token_id } = router.query

  const containerStyles = `mt-8 md:mx-auto overflow-hidden space-y-4
  border border-solid border-gray-300 dark:border-darkblue drop-shadow-md
  p-4 shadow sm:rounded-lg text-gray-500 dark:text-gray-100
  md:flex-row md:items-center md:divide-y divide-gray-200 dark:divide-gray-700`

  const containerStylesColumn = `mt-8 md:w-1/2 mx-4 md:mx-auto overflow-hidden space-y-4
  border border-solid border-gray-300 dark:border-darkblue drop-shadow-md
  p-8 shadow sm:rounded-lg text-gray-500 dark:text-gray-100
  flex-col md:items-center md:divide-y divide-gray-200 dark:divide-gray-700`

  const value = tokenData?.metadata?.image
  const imageURL = value?.includes('ipfs://') ? ipfsURItoURL(value) : value
  console.log({ tokenData })
  console.log({ imageURL })

  const openseaLink = `https://opensea.io/assets/${contract_address}/${token_id}`
  return (
    <div className="pb-4 md:pb-12">
      {tokenData && typeof contract_address === 'string' && typeof token_id === 'string' && (
        <div className={containerStylesColumn}>
          <div className="flex flex-col space-y-4 space-x-0 md:flex-row md:space-y-0">
            <div>
              <div className="w-72">
                <img src={imageURL} className="rounded object-contain h-64" />
              </div>
            </div>
            <div className="space-y-2">
              <h1 className="text-4xl">{tokenData.metadata?.name || `Token #${token_id}`}</h1>
              <h3 className="text-xl font-extrabold">{collection?.name}</h3>
              <h3 className="text-sm">{tokenData.metadata?.description}</h3>
              <h3 className="text-sm">
                <Link href={openseaLink} passHref>
                  <a target="_blank" rel="noreferrer">
                    View on Opensea
                  </a>
                </Link>
              </h3>
            </div>
          </div>
          <div className={containerStyles}>
            {tokenData.other && (
              <div className="space-y-2">
                {Object.entries(tokenData.other).map((entry, i) => {
                  const [key, value] = entry
                  return <DisplayKeyValue key={i} left={key} right={value} />
                })}
              </div>
            )}
          </div>
          <div className={containerStyles}>
            <DisplayKeyValue
              left="ERC 721 Contract"
              right={contract_address}
              link={`https://etherscan.io/address/${contract_address}#code`}
              copy
            />
            <DisplayKeyValue left="Token ID" right={token_id} />
            <DisplayKeyValue left="Token URI" right={tokenData.tokenURI} />
            <DisplayKeyValue
              left="Owner"
              link={`https://etherscan.io/address/${tokenData.owner}`}
              right={tokenData.owner}
              copy
            />
          </div>
          <div className={containerStyles}>
            {tokenData.metadata && (
              <div className="space-y-2">
                {Object.entries(tokenData.metadata).map((entry, i) => {
                  const [key, value] = entry
                  const valueURL = value.toString().slice(0, 7) === 'ipfs://' ? ipfsURItoURL(value) : value
                  const isObject = typeof valueURL === 'object'
                  return (
                    <DisplayKeyValueData key={i} left={key} right={isObject ? JSON.stringify(valueURL) : valueURL} />
                  )
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Token
