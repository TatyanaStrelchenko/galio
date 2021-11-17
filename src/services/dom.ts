import React from 'react'

const ENTER_CODE = 'Enter'

export const isEnterPressed = (e: React.KeyboardEvent) => {
  return e.nativeEvent.code === ENTER_CODE
}
