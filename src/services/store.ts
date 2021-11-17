export function reduceReducers<S>(initialState: S, ...reducers: any[]) {
  return function reducer<A = any>(state: S, action: A): S {
    return reducers.reduce(
      (nextState, reducer) => {
        return reducer(nextState, action)
      },
      typeof state === 'undefined' ? initialState : state
    )
  }
}
