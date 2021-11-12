import { fixedNumber } from '../lib/util'

const DeltaDisplay = ({ delta, denomination }: { delta: number; denomination: string }) => {
  const color = delta === 0 ? 'text-white' : delta > 0 ? 'text-green-500' : 'text-red-500'
  const charge = delta > 0 ? '+' : ''
  const deltaString = `${charge}${fixedNumber(delta)}${denomination}`
  return <span className={`${color}`}>{delta === 0 ? '--' : `${deltaString}`}</span>
}

export default DeltaDisplay
