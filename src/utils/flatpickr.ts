import type flatpickr from 'flatpickr'
import { Persian } from 'flatpickr-jalali-support/dist/esm/l10n/fa.js'

type FlatpickrOptions = flatpickr.Options.Options

export const getFlatpickrLocale = (locale: string) =>
  locale === 'fa' ? Persian : undefined

export const buildSingleDateConfig = (locale: string, overrides: FlatpickrOptions = {}) => ({
  locale: getFlatpickrLocale(locale),
  altInput: true,
  altFormat: locale === 'fa' ? 'Y/m/d' : 'F j, Y',
  dateFormat: 'Z',
  disableMobile: true,
  ...(locale === 'fa' ? { position: 'auto right' } : {}),
  ...overrides,
})

export const buildRangeDateConfig = (locale: string, overrides: FlatpickrOptions = {}) => ({
  locale: getFlatpickrLocale(locale),
  mode: 'range',
  altInput: true,
  altFormat: locale === 'fa' ? 'Y/m/d' : 'M j, Y',
  dateFormat: 'Z',
  disableMobile: true,
  ...(locale === 'fa' ? { position: 'auto right' } : {}),
  ...overrides,
})
