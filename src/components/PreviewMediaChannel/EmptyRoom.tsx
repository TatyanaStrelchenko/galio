import React from 'react'

import { useSpaces } from '../Spaces/SpacesProvider'
import { FlexBox } from '../Box/Box'
import { Text } from '../Typography/Text'

export const EmptyRoom = () => {
  const { selectedVideoChannel } = useSpaces()

  return (
    <FlexBox alignItems="center" justifyContent="center" flexGrow={1}>
      <Text bold size="big" align="center">
        <Text as="span" bold variant="success">
          {selectedVideoChannel?.name}
        </Text>
        &nbsp;currently is empty
      </Text>
    </FlexBox>
  )
}
