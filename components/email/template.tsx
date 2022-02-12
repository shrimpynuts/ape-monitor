import React from 'react'
import { Email, renderEmail } from 'react-html-email'
import Button from '../util/button'

interface HtmlEmailProps {
  title: string
}

const HtmlEmail = ({ title }: HtmlEmailProps) => (
  <Email title={title}>
    Title mane
    <Button>This is a button</Button>
    <Test />
  </Email>
)

export const Test = () => {
  return <div style={{ background: 'red' }}>this is great style brtoher</div>
}

export const WithDebug = (props: any) => {
  const { debug, ...rest } = props

  return (
    <>
      <HtmlEmail {...rest} />
      <code>{debug && renderEmail(<HtmlEmail {...rest} />)}</code>
    </>
  )
}

export default HtmlEmail
