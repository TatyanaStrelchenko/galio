import React from 'react'

import { SvgIcon, SvgIconProps } from './SvgIcon'

export const ArchiveIcon = ({
  stroke = 'currentColor',
  strokeWidth = '1.5',
  fill = 'transparent',
}: SvgIconProps) => {
  return (
    <SvgIcon viewBox="0 0 24 24" fill="none">
      <path d="M21 8V21H3V8" fill={fill} strokeWidth={strokeWidth} />
      <path
        d="M21 8V21H3V8"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M23 3H1V8H23V3Z"
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 12H14"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SvgIcon>
  )
}
