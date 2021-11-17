import React from 'react'

import { SvgIcon, SvgIconProps } from './SvgIcon'

export const RecordIcon = ({ fill = 'none', stroke = 'currentColor' }: SvgIconProps) => {
  return (
    <SvgIcon viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="9.25" stroke={stroke} strokeWidth="1.5" />
      <circle cx="10" cy="10" r="5" fill={fill} />
    </SvgIcon>
  )
}
