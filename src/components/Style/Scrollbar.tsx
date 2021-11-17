import { css } from 'styled-components'

export const scrollbarMixin = css`
  ::-webkit-scrollbar {
    width: 6px;
  }

  ::-webkit-scrollbar-thumb {
    background: #676767;
    border-radius: 50px;
  }

  ::-webkit-scrollbar-button {
    display: none;
  }
`

export const translucentScrollbarMixin = css`
  ::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.6);
  }
`

export const hiddenScrollbarMixin = css`
  ::-webkit-scrollbar-thumb {
    visibility: hidden;
  }

  :hover::-webkit-scrollbar-thumb {
    visibility: visible;
  }
`

export type BorderedScrollbarProps = {
  borderColor?: string
}

export const borderedScrollbarMixin = css<BorderedScrollbarProps>`
  ::-webkit-scrollbar {
    width: 10px;
  }

  ::-webkit-scrollbar-thumb {
    border: 2px solid ${({ borderColor = 'white' }) => borderColor};
  }
`
