import React, { useState } from 'react'

import Typist from 'react-typist'

interface IProps {
  words: String[]
  startDelay?: number
  colorOffset?: number
  colorValues: Array<string>
}

export default function InfiniteTypist({ words, startDelay = 0, colorOffset = 0, colorValues }: IProps) {
  const [index, setIndex] = useState(0)
  const word = words[index % words.length]
  const color = colorValues[(index + colorOffset) % colorValues.length]

  let Infinite = () => {
    return (
      <Typist
        startDelay={startDelay}
        onTypingDone={() => {
          setIndex((i) => i + 1)
        }}
        cursor={{
          show: false,
        }}
      >
        <p
          style={{
            background: color,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 500,
          }}
        >
          {word}
        </p>
        <Typist.Backspace count={word.length} delay={2000} />
      </Typist>
    )
  }
  return <Infinite />
}
