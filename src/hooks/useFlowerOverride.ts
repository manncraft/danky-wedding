export function useFlowerOverride(defaultName: string): string {
  const params = new URLSearchParams(window.location.search)
  const override = params.get('flower')
  const name = override ? override : defaultName
  return `/img/${name}.png`
}
