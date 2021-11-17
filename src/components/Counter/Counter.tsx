import React from 'react'
import styled, { keyframes } from 'styled-components'

const transform = keyframes`
  0% {
    opacity: 1;
  }
  
  10%, 90% {
    transform: translateY(0px);
  }
  
  100% {
    transform: translateY(20px);
  }
`

const CounterWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  min-width: 14px;
  min-height: 14px;
  /*width: 24px;*/
  height: 16px;
  font-size: 12px;
  line-height: 14px;
  overflow: hidden;
  color: #000000;
`

type CountProps = {
  animationDelay?: number
}
const Count = styled.div<CountProps>`
  position: absolute;
  width: 100%;
  text-align: center;
  font-weight: 500;
  transform: translateY(-20px);
  animation: ${transform} 1s ease-in-out forwards;

  ${({ animationDelay }) =>
    animationDelay &&
    `
    animation-delay ${animationDelay}s;
  `}
`

type Props = {
  className?: string
  value?: number
}

export const Counter = ({ className, value = 5 }: Props) => {
  return (
    <CounterWrapper className={className}>
      {Array.from({ length: value }).map((_, index) => (
        <Count animationDelay={index}>{value - index}</Count>
      ))}
    </CounterWrapper>
  )
}
