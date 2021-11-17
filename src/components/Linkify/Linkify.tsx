import React, { Fragment } from 'react'
import LinkifyIt, { Match } from 'linkify-it'
import tlds from 'tlds'

const linkifyIt = new LinkifyIt()
linkifyIt.tlds(tlds)

type LinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  match: Match
}

const Link = ({ match, target = '_blank', ...props }: LinkProps) => {
  return (
    <a href={match.url} target={target} {...props}>
      {match.text}
    </a>
  )
}

const textToLinkNodes = (text: string): React.ReactNode => {
  if (!text) {
    return text
  }

  const matches = linkifyIt.match(text)

  if (!matches) {
    return text
  }

  const elements = []
  let lastIndex = 0

  matches.forEach((match, i) => {
    if (match.index > lastIndex) {
      elements.push(text.substring(lastIndex, match.index))
    }

    elements.push(<Link key={i} match={match} />)

    lastIndex = match.lastIndex
  })

  if (text.length > lastIndex) {
    elements.push(text.substring(lastIndex))
  }

  return elements
}

const doLinkify = (children: React.ReactNode, key: number = 0): React.ReactNode => {
  if (typeof children === 'string') {
    return textToLinkNodes(children)
  }

  if (React.isValidElement(children)) {
    return React.cloneElement(children, { key }, doLinkify(children.props.children))
  }

  if (React.Children.count(children) > 1) {
    return React.Children.map(children, doLinkify)
  }

  return children
}

type Props = {
  children: React.ReactNode
}

export const Linkify = ({ children }: Props) => {
  if (typeof children === 'undefined') {
    return null
  }

  return <Fragment>{doLinkify(children)}</Fragment>
}
