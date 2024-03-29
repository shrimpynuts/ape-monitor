import { convertNumberToRoundedString } from '../../lib/util'

const DeltaDisplay = ({ delta, denomination }: { delta: number | undefined; denomination: string }) => {
  const hasNoDelta = delta === 0 || delta === undefined
  const color = hasNoDelta ? '' : delta > 0 ? 'text-green-600 dark:text-lightgreen' : 'text-red-600 text-lightred'
  const charge = delta && delta > 0 ? '+' : ''
  const deltaString = `${charge}${convertNumberToRoundedString(delta)}${denomination}`
  return (
    <span className={`${color}`}>
      {hasNoDelta ? <span className="text-gray-900 dark:text-white">-</span> : `${deltaString}`}
    </span>
  )
}

export default DeltaDisplay
