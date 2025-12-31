import type { Config } from 'tailwindcss'
import plugin from 'tailwindcss/plugin'

const logicalUtilities = plugin(({ matchUtilities, addUtilities, theme }) => {
  const spacing = theme('spacing')
  const inset = theme('inset', spacing)
  const borderWidth = theme('borderWidth')
  const radius = theme('borderRadius')

  matchUtilities(
    {
      ps: (value) => ({ paddingInlineStart: value }),
      pe: (value) => ({ paddingInlineEnd: value }),
      ms: (value) => ({ marginInlineStart: value }),
      me: (value) => ({ marginInlineEnd: value }),
    },
    { values: spacing },
  )

  matchUtilities(
    {
      start: (value) => ({ insetInlineStart: value }),
      end: (value) => ({ insetInlineEnd: value }),
    },
    { values: inset },
  )

  matchUtilities(
    {
      'border-s': (value) => ({ borderInlineStartWidth: value }),
      'border-e': (value) => ({ borderInlineEndWidth: value }),
    },
    { values: borderWidth },
  )

  matchUtilities(
    {
      'rounded-s': (value) => ({
        borderStartStartRadius: value,
        borderEndStartRadius: value,
      }),
      'rounded-e': (value) => ({
        borderStartEndRadius: value,
        borderEndEndRadius: value,
      }),
    },
    { values: radius },
  )

  addUtilities({
    '.text-start': { textAlign: 'start' },
    '.text-end': { textAlign: 'end' },
  })
})

const config: Config = {
  content: ['./index.html', './src/**/*.{vue,ts,tsx,js,jsx}'],
  theme: {
    extend: {},
  },
  plugins: [logicalUtilities],
}

export default config
