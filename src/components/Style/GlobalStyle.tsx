import { createGlobalStyle } from 'styled-components'

import { scrollbarMixin } from './Scrollbar'

export const GlobalStyle = createGlobalStyle`
  ${scrollbarMixin}
`
