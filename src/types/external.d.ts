declare module 'jalaali-js' {
  export type JalaaliDate = { jy: number; jm: number; jd: number }
  export type GregorianDate = { gy: number; gm: number; gd: number }

  export function toJalaali(
    gy: number,
    gm: number,
    gd: number,
  ): JalaaliDate
  export function toGregorian(
    jy: number,
    jm: number,
    jd: number,
  ): GregorianDate
  export function jalaaliMonthLength(jy: number, jm: number): number
}

declare module 'flatpickr-jalali-support/dist/esm/l10n/fa.js' {
  import type flatpickr from 'flatpickr'

  export const Persian: flatpickr.CustomLocale
  const l10ns: Record<string, flatpickr.CustomLocale>
  export default l10ns
}
