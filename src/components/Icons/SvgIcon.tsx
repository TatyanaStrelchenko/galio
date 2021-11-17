import React from 'react'

export type SvgIconProps = React.SVGAttributes<HTMLOrSVGElement>

type Props = SvgIconProps & {
  children: React.ReactNode
}

export const SvgIcon = ({ children, ...props }: Props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      fill="currentColor"
      viewBox="0 0 16 16"
      {...props}
    >
      {children}
    </svg>
  )
}
