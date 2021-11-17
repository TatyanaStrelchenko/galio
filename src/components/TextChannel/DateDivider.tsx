import React from 'react'
import { DateTime } from 'luxon'
import styled from 'styled-components'

const Container = styled.div`
  margin: 26px 0;
  color: #8f8f8f;
`

const Divider = styled.hr`
  padding: 0;
  height: 1px;
  margin: 26px 0;
  border: none;
  border-top: 1px solid #f0f0f0;
  text-align: center;
  overflow: visible;

  :after {
    position: relative;
    top: -9px;
    content: attr(data-date);
    font-size: 14px;
    line-height: 16px;
    padding: 2px 12px;
    border-radius: 53px;
    background-color: #f0f0f0;
  }
`

type Props = {
  date: DateTime
}

export const DateDivider = ({ date }: Props) => {
  return (
    <Container>
      <Divider data-date={date.toFormat('MMMM d')} />
    </Container>
  )
}
