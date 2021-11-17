import { fixedNumber } from '../lib/util'

const DeltaDisplay = ({ delta, denomination }: { delta: number; denomination: string }) => {
  const color =
    delta === 0 ? 'text-white' : delta > 0 ? 'text-green-600 dark:text-lightgreen' : 'text-red-600 text-lightred'
  const charge = delta > 0 ? '+' : ''
  const deltaString = `${charge}${fixedNumber(delta)}${denomination}`
  return <span className={`${color}`}>{delta === 0 ? '-' : `${deltaString}`}</span>
}

export default DeltaDisplay
