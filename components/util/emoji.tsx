import React from 'react'
const Emoji = (props: { label: string; symbol: string; className: string }) => (
  <span
    className={props.className}
    role="img"
    aria-label={props.label ? props.label : ''}
    aria-hidden={props.label ? 'false' : 'true'}
  >
    {props.symbol}
  </span>
)
export default Emoji
