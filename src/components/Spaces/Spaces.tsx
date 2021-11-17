import React, { Fragment } from 'react'
import styled from 'styled-components'

import { Space as SpaceType } from '../../types/space'

export const Space = styled.div`
  height: 32px;
  width: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: aliceblue;
  border-radius: 50%;
  cursor: pointer;
  border: 1px solid #fff;
`
type Props = {
  spaces: SpaceType[]
}

const getSpaceName = (space: SpaceType) => {
  const [first, second] = space.name.split(' ')

  if (!second) {
    return first.slice(0, 2).toUpperCase()
  }

  return `${first[0]}${second[0]}`.toUpperCase()
}

export const Spaces = ({ spaces }: Props) => {
  return (
    <Fragment>
      {spaces.map((space) => (
        <Space key={space.id}>{getSpaceName(space)}</Space>
      ))}
    </Fragment>
  )
}
