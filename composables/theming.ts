import { reactive } from 'vue'
import C from 'colorjs.io'

import { keysOf } from '@/utils/common'

enum Color {
  primary = 'p',
  secondary = 's',
  accent = 'a',
  neutral = 'n',
  'base-100' = 'b1',
  'base-200' = 'b2',
  'base-300' = 'b3',
  'base-content' = 'bc',
  info = 'in',
  success = 'su',
  warning = 'wa',
  error = 'er',
}

enum Size {
  'card-radius' = 'rounded-box',
  'btn-radius' = 'rounded-btn',
  'btn-border' = 'border-btn',
  // Other possible vars, not ~used atm
  // "rounded-badge",
  // "animation-btn",
  // "animation-input",
  // "btn-focus-scale",
  // "tab-border",
  // "tab-radius",
}

type Colors = Record<keyof typeof Color, string>
type Sizes = Record<keyof typeof Size, string>
type Theme = Colors & Sizes

export const useThemeOverrideState = () =>
  useState<Theme | null>('customTheme', () => {
    const theme = localStorage.getItem('customTheme')
    return theme ? JSON.parse(theme) : null
  })

export const useThemeOverride = () => {
  const themeOverride = useThemeOverrideState()
  const colorNames = keysOf(Color)
  const sizeNames = keysOf(Size)
  const colors = reactive(
    Object.fromEntries(
      colorNames.map((key) => [key, themeOverride.value?.[key] ?? '']),
    ) as Colors,
  )
  const sizes = reactive(
    Object.fromEntries(
      sizeNames.map((key) => [key, themeOverride.value?.[key] ?? '']),
    ) as Sizes,
  )

  const toCss = (theme: Theme) => {
    return keysOf(theme)
      .reduce<string[]>((cssVars, key) => {
        if (theme[key] === '') return cssVars
        if (key in Color) {
          const oklch = new C(theme[key])
            .to('oklch')
            .coords.map((n) => (isNaN(n) ? 0 : n))
            .join(' ')
          cssVars.push(`--${Color[key as keyof Colors]}: ${oklch};`)
        } else {
          cssVars.push(`--${Size[key as keyof Sizes]}: ${theme[key]}rem;`)
        }
        return cssVars
      }, [])
      .join('')
  }

  const update = (theme: Theme | null) => {
    localStorage.setItem('customTheme', theme ? JSON.stringify(theme) : '')
    document
      .querySelector('html')!
      .setAttribute('style', theme ? toCss(theme) : '')
  }

  watch([sizes, colors], () => {
    update({ ...colors, ...sizes })
  })

  return {
    init: update,
    colors,
    sizes,
  }
}
