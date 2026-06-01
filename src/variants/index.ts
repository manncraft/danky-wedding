const VARIANTS = ['default', 'stacking', 'panels'] as const
export type VariantId = typeof VARIANTS[number]

export function useVariant(): VariantId {
  const param = new URLSearchParams(window.location.search).get('variant') ?? ''
  return (VARIANTS as readonly string[]).includes(param)
    ? (param as VariantId)
    : 'default'
}
