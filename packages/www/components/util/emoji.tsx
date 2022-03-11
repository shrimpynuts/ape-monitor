import React from 'react'
const Emoji = (props: { style?: any; label: string; symbol: string; className?: string }) => (
  <span
    className={props.className}
    role="img"
    aria-label={props.label ? props.label : ''}
    style={props.style}
    aria-hidden={props.label ? 'false' : 'true'}
  >
    {props.symbol}
  </span>
)
export default Emoji
