import Image from 'next/image'
import { DuplicateIcon, ExternalLinkIcon } from '@heroicons/react/outline'
import { DuplicateIcon as DuplicateIconSolid } from '@heroicons/react/solid'
import useClipboard from 'react-use-clipboard'
import Link from 'next/link'

import { ipfsURItoURL, contractIsOpensea } from '../../lib/ethers/metadata'
import { ICollection, ITokenData } from '../../frontend/types'
import Placeholder from '../../public/placeholder.jpeg'
import { permanenceGradeToColor, protocolToColor } from '../../lib/ethers/metadata'

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
    <div className="flex justify-between pt-2 overflow-x-hidden">
      <span>{left}:</span>
      <div className="flex items-center space-x-2">
        <div className="max-w-md overflow-hidden truncate">
          <span className="text-ellipsis  truncate">{right}</span>
        </div>

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
        <div className="max-w-lg whitespace-pre-line truncate">
          <span className="text-ellipsis line-clamp-3 hover:line-clamp-6">{right}</span>
        </div>
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
  contract_address: string | string[] | undefined
  token_id: string | string[] | undefined
}

const Token = ({ tokenData, collection, contract_address, token_id }: IProps) => {
  // Styles
  const containerStyles = `mt-2 md:mx-auto overflow-hidden space-y-4
  border border-solid border-gray-300 dark:border-darkblue drop-shadow-md
  p-4 shadow sm:rounded-lg text-gray-500 dark:text-gray-100
  md:flex-row md:items-center md:divide-y divide-gray-200 dark:divide-gray-700`
  const containerStylesNoDivide = `mt-2 md:mx-auto overflow-hidden space-y-4
  border border-solid border-gray-300 dark:border-darkblue drop-shadow-md
  p-4 shadow sm:rounded-lg text-gray-500 dark:text-gray-100
  md:flex-row md:items-center `
  const containerStylesColumn = `mt-8 md:max-w-5xl mx-4 md:mx-auto overflow-hidden space-y-2
  border border-solid border-gray-300 dark:border-darkblue drop-shadow-md
  p-8 shadow sm:rounded-lg text-gray-500 dark:text-gray-100
  flex-col md:items-center `
  const sectionTitleStyles = 'text-2xl font-bold ml-2 tracking-wide leading-relaxed	'

  // Retrieving constants
  const value = tokenData?.metadata?.image
  const imageURL = value?.includes('ipfs://') ? ipfsURItoURL(value) : value
  const openseaLink = `https://opensea.io/assets/${contract_address}/${token_id}`
  const checkmynftLink = `https://checkmynft.com/?address=${contract_address}&id=${token_id}`
  const etherscanLink = `https://etherscan.io/address/${contract_address}#code`

  return (
    <div className="pb-4 md:pb-12">
      {/* To exclude yellow-500 from css purges */}
      <div className="hidden text-yellow-500"></div>

      {tokenData && typeof contract_address === 'string' && typeof token_id === 'string' && (
        <div className={containerStylesColumn}>
          <div className="flex flex-col space-y-4 space-x-0 md:flex-row md:space-y-0">
            <div>
              <div className="w-64 mr-4">
                {imageURL ? (
                  <img src={imageURL} className="rounded object-contain h-64" />
                ) : (
                  <div className="mr-4">
                    <Image src={Placeholder} height={530} className="rounded object-contain" />
                  </div>
                )}
              </div>
            </div>
            <div>
              <div className="space-y-2">
                <h1 className="text-4xl truncate max-w-md">{tokenData.metadata?.name || `Token #${token_id}`}</h1>
                {tokenData.metadata?.name && <h2 className="text-lg italic leading-none">{`Token #${token_id}`}</h2>}
                <h3 className="text-xl font-extrabold tracking-wide leading-none">
                  {contractIsOpensea(contract_address) ? 'Opensea Storefront' : collection?.name}
                </h3>
                <h3 className="text-sm pt-2 md:pt-0 line-clamp-5 hover:line-clamp-none">
                  {tokenData.metadata?.description}
                </h3>
              </div>

              <div className="mt-4 md:flex md:space-x-4">
                <h3 className="text-sm italic">
                  <Link href={openseaLink} passHref>
                    <a target="_blank" rel="noreferrer">
                      View on Opensea
                    </a>
                  </Link>
                </h3>
                <h3 className="text-sm italic">
                  <Link href={checkmynftLink} passHref>
                    <a target="_blank" rel="noreferrer">
                      View on Check My NFT
                    </a>
                  </Link>
                </h3>
              </div>
            </div>
          </div>
          <h2 className={sectionTitleStyles}>
            Permanence Grade:{' '}
            <span className={permanenceGradeToColor(tokenData.permanenceGrade)}>{tokenData.permanenceGrade}</span>
          </h2>
          <div className={containerStylesNoDivide}>
            <div className="flex flex-col md:flex-row md:space-x-2 font-bold text-lg">
              <span className="">
                Metadata Storage:{' '}
                {tokenData.protocol ? (
                  <span className={protocolToColor(tokenData.protocol)}>{tokenData.protocol}</span>
                ) : (
                  'Unknown'
                )}
              </span>
              <span className="hidden md:block">,</span>
              <span className="">
                Image Storage:{' '}
                {tokenData.imageProtocol ? (
                  <span className={protocolToColor(tokenData.imageProtocol)}>{tokenData.imageProtocol}</span>
                ) : (
                  'Unknown'
                )}
              </span>
            </div>
            <p className="">{tokenData.permanenceDescription}</p>
          </div>
          <h2 className={sectionTitleStyles}>Details</h2>
          <div className={containerStyles}>
            <DisplayKeyValue left="Metadata (Token URI)" right={tokenData.tokenURI} link={tokenData.tokenURL} copy />
            <DisplayKeyValue left="Contract Address" right={contract_address} link={etherscanLink} copy />
            <DisplayKeyValue
              left="Owner"
              link={`https://apemonitor.com/${tokenData.owner}`}
              right={tokenData.owner}
              copy
            />
          </div>
          <div className="flex items-center space-x-2">
            <h2 className={sectionTitleStyles}>Metadata</h2>
            {/* <div className="max-w-sm hover:max-w-lg overflow-hidden truncate">{tokenData.tokenURI}</div> */}
          </div>
          <div className={containerStyles}>
            {tokenData.metadata ? (
              <div className="space-y-2">
                {Object.entries(tokenData.metadata).map((entry, i) => {
                  const [key, value] = entry
                  const isObject = typeof value === 'object'
                  return <DisplayKeyValueData key={i} left={key} right={isObject ? JSON.stringify(value) : value} />
                })}
              </div>
            ) : (
              <div>
                <span className="text-red-400">
                  Experienced error fetching metadata. Likely a CORS issue due to the NFT metadata being stored on a
                  centralized server.
                </span>
              </div>
            )}
          </div>
          <div className="mt-2 italic text-sm">
            For bug reports or feature requests please tweet me:{' '}
            <a className="underline" target="_blank" rel="noreferrer" href="https://twitter.com/jonathanmcai">
              @jonathanmcai
            </a>
            .
          </div>
        </div>
      )}
    </div>
  )
}

export default Token
