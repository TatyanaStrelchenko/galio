import { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { Location } from 'history'

import { getLastNavigationPath, setLastNavigationPath } from '../services/urls'

const getFullPath = ({ pathname, search }: Location) => {
  let url = pathname

  if (search) {
    url += `?${search}`
  }

  return url
}

export const useLastNavigationPathEffect = () => {
  const history = useHistory()

  useEffect(() => {
    const lastNavigationUrl = getLastNavigationPath()
    const currentNavigationUrl = getFullPath(history.location)

    if (lastNavigationUrl && currentNavigationUrl === '/') {
      history.replace(lastNavigationUrl)
    }
  }, [history])

  useEffect(() => {
    return history.listen((location) => {
      setLastNavigationPath(getFullPath(location))
    })
  }, [history])
}
