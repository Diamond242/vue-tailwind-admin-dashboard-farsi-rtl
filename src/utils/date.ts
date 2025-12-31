const pad2 = (value: number) => String(value).padStart(2, '0')

export const formatLocalDate = (date: Date) =>
  `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`

export const parseLocalDate = (value: string) => {
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export const addDays = (date: Date, amount: number) => {
  const next = new Date(date)
  next.setDate(next.getDate() + amount)
  return next
}

export const addDaysToDateKey = (dateKey: string, amount: number) =>
  formatLocalDate(addDays(parseLocalDate(dateKey), amount))

export const toIsoFromDateKey = (dateKey: string) => parseLocalDate(dateKey).toISOString()
