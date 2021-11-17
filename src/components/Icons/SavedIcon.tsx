import React from 'react'

import { SvgIcon, SvgIconProps } from './SvgIcon'

export const SavedIcon = ({
  strokeWidth = '1.2',
  fill = 'transparent',
  stroke = 'currentColor',
}: SvgIconProps) => {
  return (
    <SvgIcon viewBox="0 0 16 16" fill="none">
      <path
        d="M11.8889 2H4.11111C3.49746 2 3 2.59695 3 3.33333V12.6667C3 13.2758 3 13.7895 3.56614 13.9489C3.83481 14.0245 4.10783 13.8834 4.29714 13.6783L8 9.66667L11.703 13.6783C11.8923 13.8834 12.1654 14.0245 12.434 13.9489C13 13.7895 13 13.2758 13 12.6667V3.33333C13 2.59695 12.5025 2 11.8889 2Z"
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SvgIcon>
  )
}
