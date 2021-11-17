type Referrer = string | null

type ReferrerValue = {
  referrer: Referrer
  setReferrer: (nextReferrer: Referrer) => void
  getAndErase: () => Referrer
}

export const useReferrer = (): ReferrerValue => {
  const referrer = sessionStorage.getItem('referrer')

  const setReferrer = (referrer: Referrer): void => {
    if (referrer === null) {
      sessionStorage.removeItem('referrer')

      return
    }

    try {
      sessionStorage.setItem('referrer', referrer)
    } catch (e) {
      console.log('Failed to set referrer')
    }
  }

  const getAndErase = (): Referrer => {
    sessionStorage.removeItem('referrer')

    return referrer
  }

  return { referrer, setReferrer, getAndErase }
}
