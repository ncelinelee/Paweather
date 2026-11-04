// Each UI request owns a token. New input, reset and disposal invalidate old work.
export const createLatestRequest = () => {
  let revision = 0
  return {
    start: () => ++revision,
    invalidate: () => { revision += 1 },
    isCurrent: (token) => token === revision
  }
}
