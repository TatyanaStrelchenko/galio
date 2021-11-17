import { compile, PathFunction as BasePathFunction } from 'path-to-regexp'

const LAST_NAVIGATION_PATH = 'last_navigation_path'

export const getLastNavigationPath = () => {
  return localStorage.getItem(LAST_NAVIGATION_PATH) || ''
}

export const setLastNavigationPath = (path: string) => {
  localStorage.setItem(LAST_NAVIGATION_PATH, path)
}

const ORIGIN = window.location.origin

export type AppUrlParams = {
  type?: 't' | 'v'
  hash?: string
}

type PathFunction<P extends object> = BasePathFunction<P> & {
  path: string
  href: (data?: P) => string
}

const createPathFunction = <P extends object>(path: string): PathFunction<P> => {
  const compiler = compile<P>(path) as PathFunction<P>

  compiler.path = path
  compiler.href = (data) => ORIGIN + compiler(data)

  return compiler
}

export const generateAppUrl = createPathFunction<AppUrlParams>('/:type(t|v)?/:hash?')

export type VideoUrlParams = {
  videoId: string
}

export const generateVideoUrl = createPathFunction<VideoUrlParams>('/video/:videoId')
