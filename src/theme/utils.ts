import { FlattenInterpolation, ThemedStyledProps, ThemeProps } from 'styled-components'
import { colors, Theme } from './theme'

export const getColor = (color: keyof typeof colors) => ({ theme }: ThemeProps<Theme>) => {
  const value = theme.colors[color]

  if (!value) {
    throw new Error(`Unknown color '${color}'. Please provide an existing color`)
  }

  return value
}

type ThemeValueResult =
  | string
  | FlattenInterpolation<ThemeProps<Theme>>
  | FlattenInterpolation<ThemedStyledProps<any, Theme>>
type ThemeValueFn = (props: any) => ThemeValueResult
type ThemeValue = ThemeValueFn | ThemeValueResult

interface ThemeMap {
  [key: string]: ThemeValue
}

export const createVariant = (prop: string, values: ThemeMap) => {
  return (props: any) => {
    const value = values[props[prop]]

    return value ? value : ''
  }
}
