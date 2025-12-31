<template>
  <div class="overflow-hidden">
    <div
      class="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 px-4 py-4 dark:border-gray-800 sm:px-6"
    >
      <div class="flex items-center gap-2">
        <button
          type="button"
          class="rounded-lg border border-gray-200 bg-white px-2.5 py-2 text-gray-600 shadow-theme-xs hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-white/[0.03]"
          @click="goToPrevMonth"
        >
          <span class="sr-only">{{ t('calendar.jalali.prevMonth') }}</span>
          <svg
            class="h-4 w-4 rtl:rotate-180"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 12L6 8L10 4"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
        <button
          type="button"
          class="rounded-lg border border-gray-200 bg-white px-2.5 py-2 text-gray-600 shadow-theme-xs hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-white/[0.03]"
          @click="goToNextMonth"
        >
          <span class="sr-only">{{ t('calendar.jalali.nextMonth') }}</span>
          <svg
            class="h-4 w-4 rtl:rotate-180"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 4L10 8L6 12"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
        <button
          type="button"
          class="flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 ltr:flex-row-reverse"
          @click="emit('add-event')"
        >
          <span class="text-base font-semibold">+</span>
          <span>{{ t('calendar.toolbar.addEvent') }}</span>
        </button>
      </div>

      <div class="text-left text-lg font-semibold text-gray-800 dark:text-white/90">
        {{ currentMonthLabel }}
      </div>
    </div>

    <div class="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-800">
      <div
        v-for="(day, index) in weekDays"
        :key="`${day.short}-${index}`"
        class="bg-white px-2 py-2 text-center text-sm font-medium text-gray-600 dark:bg-gray-900 dark:text-gray-300"
      >
        <span class="lg:hidden">{{ day.short }}</span>
        <span class="hidden lg:block">{{ day.long }}</span>
      </div>
    </div>

    <div class="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-800">
      <button
        v-for="day in calendarDays"
        :key="day.key"
        type="button"
        class="relative min-h-[120px] bg-white p-2 text-start align-top dark:bg-gray-900"
        :class="{
          'cursor-default opacity-40': day.isOutside,
          'ring-1 ring-brand-400 ring-inset': day.isToday,
        }"
        :disabled="day.isOutside"
        @click="handleDaySelect(day)"
      >
        <span
          class="inline-flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold text-gray-800 dark:text-white/90"
        >
          {{ day.label }}
        </span>

        <div class="mt-2 space-y-1">
          <button
            v-for="event in day.events"
            :key="event.id"
            type="button"
            class="event-fc-color flex w-full items-center gap-2 text-start"
            :class="eventColorClass(event)"
            @click.stop="emit('select-event', event)"
          >
            <span class="fc-daygrid-event-dot"></span>
            <span class="fc-event-title truncate">{{ event.title }}</span>
          </button>
        </div>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { jalaaliMonthLength, toGregorian, toJalaali } from 'jalaali-js'
import { addDaysToDateKey, formatLocalDate, parseLocalDate } from '@/utils/date'

type CalendarEvent = {
  id: string
  title: string
  start: string
  end?: string
  extendedProps?: {
    calendar?: string
  }
}

type DayCell = {
  key: string
  label: string
  dateKey: string | null
  isOutside: boolean
  isToday: boolean
  events: CalendarEvent[]
}

type WeekDayLabel = {
  short: string
  long: string
}

const props = defineProps<{
  events: CalendarEvent[]
}>()

const emit = defineEmits<{
  (event: 'select-day', dateKey: string): void
  (event: 'select-event', calendarEvent: CalendarEvent): void
  (event: 'add-event'): void
}>()

const { locale, t, tm } = useI18n()

const today = new Date()
const todayJalali = toJalaali(
  today.getFullYear(),
  today.getMonth() + 1,
  today.getDate(),
)

const currentYear = ref(todayJalali.jy)
const currentMonth = ref(todayJalali.jm)

const weekDays = computed<WeekDayLabel[]>(() => {
  const shortLabels =
    (tm('calendar.jalali.weekdaysShort') as string[]) ||
    (tm('calendar.jalali.weekdays') as string[]) ||
    []
  const longLabels =
    (tm('calendar.jalali.weekdaysLong') as string[]) || shortLabels || []

  return shortLabels.map((label, index) => ({
    short: label,
    long: longLabels[index] || label,
  }))
})
const monthNames = computed(() => (tm('calendar.jalali.months') as string[]) || [])

const numberFormatter = computed(
  () =>
    new Intl.NumberFormat(locale.value === 'fa' ? 'fa-IR' : 'en-US', {
      maximumFractionDigits: 0,
    }),
)

const currentMonthLabel = computed(() => {
  const monthName = monthNames.value[currentMonth.value - 1] || ''
  const year = numberFormatter.value.format(currentYear.value)
  return t('calendar.jalali.monthLabel', { month: monthName, year })
})

const normalizeDateKey = (value?: string) => {
  if (!value) {
    return null
  }
  if (value.includes('T')) {
    return formatLocalDate(new Date(value))
  }
  return value
}

const eventsByDate = computed(() => {
  const map = new Map<string, CalendarEvent[]>()

  props.events.forEach((event) => {
    const startKey = normalizeDateKey(event.start)
    const endKey = normalizeDateKey(event.end || event.start)

    if (!startKey || !endKey) {
      return
    }

    const inclusiveEndKey = event.end ? addDaysToDateKey(endKey, -1) : endKey
    let cursor = parseLocalDate(startKey)
    const endDate = parseLocalDate(inclusiveEndKey)

    while (cursor <= endDate) {
      const key = formatLocalDate(cursor)
      const bucket = map.get(key) ?? []
      bucket.push(event)
      map.set(key, bucket)
      cursor = new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate() + 1)
    }
  })

  return map
})

const calendarDays = computed<DayCell[]>(() => {
  const year = currentYear.value
  const month = currentMonth.value
  const totalDays = jalaaliMonthLength(year, month)
  const firstGregorian = toGregorian(year, month, 1)
  const firstDate = new Date(
    firstGregorian.gy,
    firstGregorian.gm - 1,
    firstGregorian.gd,
  )
  const offset = (firstDate.getDay() + 1) % 7
  const totalCells = Math.ceil((totalDays + offset) / 7) * 7

  return Array.from({ length: totalCells }, (_, index) => {
    const dayNumber = index - offset + 1
    const isOutside = dayNumber < 1 || dayNumber > totalDays

    if (isOutside) {
      return {
        key: `outside-${index}`,
        label: '',
        dateKey: null,
        isOutside: true,
        isToday: false,
        events: [],
      }
    }

    const gregorian = toGregorian(year, month, dayNumber)
    const date = new Date(gregorian.gy, gregorian.gm - 1, gregorian.gd)
    const dateKey = formatLocalDate(date)
    const isToday =
      dayNumber === todayJalali.jd &&
      month === todayJalali.jm &&
      year === todayJalali.jy

    return {
      key: dateKey,
      label: numberFormatter.value.format(dayNumber),
      dateKey,
      isOutside: false,
      isToday,
      events: eventsByDate.value.get(dateKey) ?? [],
    }
  })
})

const goToPrevMonth = () => {
  if (currentMonth.value === 1) {
    currentMonth.value = 12
    currentYear.value -= 1
    return
  }
  currentMonth.value -= 1
}

const goToNextMonth = () => {
  if (currentMonth.value === 12) {
    currentMonth.value = 1
    currentYear.value += 1
    return
  }
  currentMonth.value += 1
}

const handleDaySelect = (day: DayCell) => {
  if (!day.dateKey) {
    return
  }
  emit('select-day', day.dateKey)
}

const eventColorClass = (event: CalendarEvent) => {
  const level = event.extendedProps?.calendar || 'primary'
  return `fc-bg-${level}`
}
</script>
