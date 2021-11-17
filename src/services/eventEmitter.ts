type Callback = (...args: any[]) => void

type EventEmitter = {
  on: (name: string, callback: Callback) => void
  off: (name: string, callback: Callback) => void
  dispatch: (name: string, ...args: any[]) => void
}

export const createEventEmitter = (): EventEmitter => {
  const events: Record<string, Set<Callback>> = {}

  const on = (name: string, callback: Callback) => {
    if (!events[name]) {
      events[name] = new Set<Callback>()
    }

    events[name].add(callback)
  }

  const off = (name: string, callback: Callback) => {
    if (!events[name]) {
      return
    }

    events[name].delete(callback)
  }

  const dispatch = (name: string, ...args: any[]) => {
    events[name]?.forEach((callback) => {
      callback(...args)
    })
  }

  return { on, off, dispatch }
}
