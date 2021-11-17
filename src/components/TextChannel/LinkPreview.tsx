import React, { Fragment } from 'react'
import styled from 'styled-components'

import { MessageAttachment } from '../../types/space'
import { createVariant } from '../../theme/utils'
import { Text } from '../Typography/Text'
import { FlexBox } from '../Box/Box'

type AnchorProps = {
  target?: '_blank'
}

export type VariantProps = {
  variant?: 'small' | 'normal'
}

const Link = styled(Text)<AnchorProps>`
  display: block;
  text-decoration: none;
  margin-bottom: 4px;
`

const MainLink = styled(Link)`
  line-height: 21px;
`

const containerVariant = createVariant('variant', {
  small: 'padding: 8px;',
  normal: `
    padding: 12px;
    max-width: 700px;
  `,
})

const Container = styled.div<VariantProps>`
  border-radius: 4px;
  background: #f6f6f6;
  ${containerVariant}
`

const separatorVariant = createVariant('variant', {
  small: `
    margin: 0 4px;
    border-right: 1px solid #d6d6d6;
  `,
  normal: `
    margin: 0 8px;
    border-right: 1px solid #5C5C5C;
  `,
})

const Separator = styled.div<VariantProps>`
  width: 1px;
  min-height: 100%;
  border-radius: 3px;
  ${separatorVariant}
`

const logoWrapperVariant = createVariant('variant', {
  small: `
    border-radius: 4px;
    max-width: 42px;
    max-height: 42px;
  `,
  normal: `
    border-radius: 6px;
    max-width: 84px;
    max-height: 84px;
  `,
})

const radiusVariant = createVariant('variant', {
  small: 'border-radius: 4px;',
  normal: 'border-radius: 6px;',
})

const LogoWrapper = styled.div<VariantProps>`
  line-height: 12px;
  text-align: center;
  ${logoWrapperVariant}
  ${radiusVariant}
`

const logoVariant = createVariant('variant', {
  small: 'max-width: 42px;',
  normal: 'max-width: 84px;',
})

const Logo = styled.img<VariantProps>`
  width: auto;
  ${logoVariant}
  ${radiusVariant}
`

const ContentWrapper = styled.div`
  min-width: 0;
`

type Props = VariantProps & {
  link: MessageAttachment
}

export const LinkPreview = ({ link, variant = 'small' }: Props) => {
  return (
    <Container variant={variant}>
      <MainLink as="a" href={link.url} truncate size="normal" variant="linkAlt" target="_blank">
        {link.url}
      </MainLink>
      <FlexBox>
        {link.logo_url && (
          <Fragment>
            <LogoWrapper variant={variant}>
              <Logo variant={variant} src={link.logo_url} alt="Url Logo" />
            </LogoWrapper>
            <Separator variant={variant} />
          </Fragment>
        )}
        <ContentWrapper>
          <Link
            bold
            truncate
            as="a"
            href={link.url}
            size={variant}
            variant="linkAlt"
            target="_blank"
          >
            {link.title}
          </Link>
          {link.description && (
            <Text wordBreak="break-word" size={variant}>
              {link.description}
            </Text>
          )}
        </ContentWrapper>
      </FlexBox>
    </Container>
  )
}
