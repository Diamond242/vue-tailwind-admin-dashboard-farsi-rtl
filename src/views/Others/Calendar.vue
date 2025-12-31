<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div
      class="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]"
    >
      <div class="custom-calendar">
        <FullCalendar
          v-if="!isFa"
          ref="calendarRef"
          class="min-h-screen"
          :options="calendarOptions"
        />
        <JalaliCalendar
          v-else
          :events="events"
          @add-event="openModal"
          @select-day="handleJalaliDateSelect"
          @select-event="handleJalaliEventClick"
        />
      </div>

      <!-- Modal -->
      <Modal v-if="isOpen" @close="closeModal">
        <template #body>
          <div
            class="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11"
          >
            <h5
              class="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl"
            >
              {{
                selectedEvent ? t('calendar.modal.titleEdit') : t('calendar.modal.titleAdd')
              }}
            </h5>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ t('calendar.modal.subtitle') }}
            </p>

            <div class="mt-8">
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  {{ t('calendar.modal.labels.eventTitle') }}
                </label>
                <input
                  v-model="eventTitle"
                  type="text"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                />
              </div>

              <div class="mt-6">
                <label class="block mb-4 text-sm font-medium text-gray-700 dark:text-gray-400">
                  {{ t('calendar.modal.labels.eventColor') }}
                </label>
                <div class="flex flex-wrap items-center gap-4 sm:gap-5">
                  <div v-for="level in calendarLevels" :key="level.id" class="n-chk">
                    <div :class="`form-check form-check-${level.id} form-check-inline`">
                      <label
                        class="flex items-center text-sm text-gray-700 form-check-label dark:text-gray-400"
                        :for="`modal${level.id}`"
                      >
                        <span class="relative">
                          <input
                            type="radio"
                            :name="'event-level'"
                            :value="level.id"
                            :id="`modal${level.id}`"
                            v-model="eventLevel"
                            class="sr-only form-check-input"
                          />
                          <span
                            class="flex items-center justify-center w-5 h-5 mr-2 border border-gray-300 rounded-full box dark:border-gray-700"
                          >
                            <span class="w-2 h-2 bg-white rounded-full dark:bg-transparent"></span>
                          </span>
                        </span>
                        {{ level.label }}
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div class="mt-6">
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  {{ t('calendar.modal.labels.startDate') }}
                </label>
                <flat-pickr
                  v-model="eventStartDate"
                  :config="eventDateConfig"
                  class="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                />
              </div>

              <div class="mt-6">
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  {{ t('calendar.modal.labels.endDate') }}
                </label>
                <flat-pickr
                  v-model="eventEndDate"
                  :config="eventDateConfig"
                  class="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                />
              </div>
            </div>

            <div class="flex items-center gap-3 mt-6 modal-footer sm:justify-end">
              <button
                @click="closeModal"
                class="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto"
              >
                {{ t('calendar.modal.buttons.close') }}
              </button>

              <button
                @click="handleAddOrUpdateEvent"
                class="btn btn-success btn-update-event flex w-full justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 sm:w-auto"
              >
                {{
                  selectedEvent ? t('calendar.modal.buttons.update') : t('calendar.modal.buttons.add')
                }}
              </button>
              <button
                v-if="selectedEvent"
                @click="handleDeleteEvent"
                class="flex w-full justify-center rounded-lg border border-error-500 bg-error-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-error-600 sm:w-auto"
              >
                {{ t('calendar.modal.buttons.delete') }}
              </button>
            </div>
          </div>
        </template>
      </Modal>
      <!-- <Teleport to="body">
        <div v-if="isOpen" class="modal-backdrop" @click="closeModal"></div>
        <div v-if="isOpen" class="modal">
          <div >
            <h5
              class="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl"
            >
              {{ selectedEvent ? 'Edit Event' : 'Add Event' }}
            </h5>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Plan your next big moment: schedule or edit an event to stay on track
            </p>

            <div class="mt-8">
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Event Title
                </label>
                <input
                  v-model="eventTitle"
                  type="text"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                />
              </div>

              <div class="mt-6">
                <label class="block mb-4 text-sm font-medium text-gray-700 dark:text-gray-400">
                  Event Color
                </label>
                <div class="flex flex-wrap items-center gap-4 sm:gap-5">
                  <div v-for="(value, key) in calendarsEvents" :key="key" class="n-chk">
                    <div :class="`form-check form-check-${value} form-check-inline`">
                      <label
                        class="flex items-center text-sm text-gray-700 form-check-label dark:text-gray-400"
                        :for="`modal${key}`"
                      >
                        <span class="relative">
                          <input
                            type="radio"
                            :name="'event-level'"
                            :value="key"
                            :id="`modal${key}`"
                            v-model="eventLevel"
                            class="sr-only form-check-input"
                          />
                          <span
                            class="flex items-center justify-center w-5 h-5 mr-2 border border-gray-300 rounded-full box dark:border-gray-700"
                          >
                            <span class="w-2 h-2 bg-white rounded-full dark:bg-transparent"></span>
                          </span>
                        </span>
                        {{ key }}
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div class="mt-6">
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Enter Start Date
                </label>
                <input
                  v-model="eventStartDate"
                  type="date"
                  class="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                />
              </div>

              <div class="mt-6">
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Enter End Date
                </label>
                <input
                  v-model="eventEndDate"
                  type="date"
                  class="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                />
              </div>
            </div>

            <div class="flex items-center gap-3 mt-6 modal-footer sm:justify-end">
              <button
                @click="closeModal"
                class="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto"
              >
                Close
              </button>
              <button
                @click="handleAddOrUpdateEvent"
                class="btn btn-success btn-update-event flex w-full justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 sm:w-auto"
              >
                {{ selectedEvent ? 'Update Changes' : 'Add Event' }}
              </button>
            </div>
          </div>
        </div>
      </Teleport> -->
    </div>
  </AdminLayout>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import flatPickr from 'vue-flatpickr-component'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import Modal from '@/components/profile/Modal.vue'
import JalaliCalendar from '@/components/calendar/JalaliCalendar.vue'
import { buildSingleDateConfig } from '@/utils/flatpickr'
import { addDaysToDateKey, formatLocalDate, toIsoFromDateKey } from '@/utils/date'

const { locale, t } = useI18n()
const isFa = computed(() => locale.value === 'fa')

const currentPageTitle = computed(() => t('calendar.pageTitle'))

const calendarRef = ref(null)
const isOpen = ref(false)
const selectedEvent = ref(null)
const eventTitle = ref('')
const eventStartDate = ref('')
const eventEndDate = ref('')
const eventLevel = ref('primary')
const events = ref([])

const calendarLevels = computed(() => [
  { id: 'danger', label: t('calendar.colors.danger') },
  { id: 'success', label: t('calendar.colors.success') },
  { id: 'primary', label: t('calendar.colors.primary') },
  { id: 'warning', label: t('calendar.colors.warning') },
])

const eventDateConfig = computed(() =>
  buildSingleDateConfig(locale.value, {
    altFormat: locale.value === 'fa' ? 'Y/m/d' : 'F j, Y',
  }),
)

const buildSeedEvents = () => {
  const todayKey = formatLocalDate(new Date())

  return [
    {
      id: '1',
      title: t('calendar.events.conference'),
      start: todayKey,
      extendedProps: {
        calendar: 'danger',
        titleKey: 'calendar.events.conference',
      },
    },
    {
      id: '2',
      title: t('calendar.events.meeting'),
      start: addDaysToDateKey(todayKey, 1),
      extendedProps: {
        calendar: 'success',
        titleKey: 'calendar.events.meeting',
      },
    },
    {
      id: '3',
      title: t('calendar.events.workshop'),
      start: addDaysToDateKey(todayKey, 2),
      end: addDaysToDateKey(todayKey, 4),
      extendedProps: {
        calendar: 'primary',
        titleKey: 'calendar.events.workshop',
      },
    },
  ]
}

onMounted(() => {
  events.value = buildSeedEvents()
})

watch(locale, () => {
  events.value = events.value.map((event) => {
    const titleKey = event.extendedProps?.titleKey
    if (!titleKey) {
      return event
    }
    return {
      ...event,
      title: t(titleKey),
    }
  })
})

const openModal = () => {
  isOpen.value = true
}

const closeModal = () => {
  isOpen.value = false
  resetModalFields()
}

const resetModalFields = () => {
  eventTitle.value = ''
  eventStartDate.value = ''
  eventEndDate.value = ''
  eventLevel.value = 'primary'
  selectedEvent.value = null
}

const toDateKeyFromIso = (value) => (value ? formatLocalDate(new Date(value)) : '')

const setModalDatesFromKeys = (startKey, endKeyInclusive) => {
  eventStartDate.value = startKey ? toIsoFromDateKey(startKey) : ''
  eventEndDate.value = endKeyInclusive ? toIsoFromDateKey(endKeyInclusive) : ''
}

const handleDateSelect = (selectInfo) => {
  resetModalFields()
  const startKey = selectInfo.startStr
  const endKeyExclusive = selectInfo.endStr
  const endKeyInclusive = endKeyExclusive ? addDaysToDateKey(endKeyExclusive, -1) : startKey
  setModalDatesFromKeys(startKey, endKeyInclusive)
  openModal()
}

const handleJalaliDateSelect = (dateKey) => {
  resetModalFields()
  setModalDatesFromKeys(dateKey, dateKey)
  openModal()
}

const handleEventClick = (clickInfo) => {
  const event = clickInfo.event
  selectedEvent.value = event
  eventTitle.value = event.title
  eventLevel.value = event.extendedProps?.calendar || 'primary'

  const startKey = event.start ? formatLocalDate(event.start) : ''
  const endKeyExclusive = event.end ? formatLocalDate(event.end) : ''
  const endKeyInclusive = endKeyExclusive ? addDaysToDateKey(endKeyExclusive, -1) : ''
  setModalDatesFromKeys(startKey, endKeyInclusive)
  openModal()
}

const handleJalaliEventClick = (event) => {
  selectedEvent.value = event
  eventTitle.value = event.title
  eventLevel.value = event.extendedProps?.calendar || 'primary'

  const endKeyInclusive = event.end ? addDaysToDateKey(event.end, -1) : ''
  setModalDatesFromKeys(event.start, endKeyInclusive)
  openModal()
}

const resolveTitleKey = (event) => {
  const titleKey = event?.extendedProps?.titleKey
  if (!titleKey) {
    return undefined
  }
  return eventTitle.value === t(titleKey) ? titleKey : undefined
}

const handleAddOrUpdateEvent = () => {
  const startKey = toDateKeyFromIso(eventStartDate.value)
  if (!startKey) {
    return
  }

  const endKeyInclusive = toDateKeyFromIso(eventEndDate.value)
  const endKeyExclusive = endKeyInclusive ? addDaysToDateKey(endKeyInclusive, 1) : undefined
  const level = eventLevel.value || 'primary'
  const titleKey = resolveTitleKey(selectedEvent.value)
  const extendedProps = {
    calendar: level,
    ...(titleKey ? { titleKey } : {}),
  }

  if (selectedEvent.value) {
    events.value = events.value.map((event) =>
      event.id === selectedEvent.value.id
        ? {
            ...event,
            title: eventTitle.value,
            start: startKey,
            end: endKeyExclusive,
            allDay: true,
            extendedProps,
          }
        : event,
    )
  } else {
    const newEvent = {
      id: Date.now().toString(),
      title: eventTitle.value,
      start: startKey,
      end: endKeyExclusive,
      allDay: true,
      extendedProps,
    }
    events.value.push(newEvent)
  }
  closeModal()
}

const handleDeleteEvent = () => {
  if (selectedEvent.value) {
    events.value = events.value.filter((event) => event.id !== selectedEvent.value.id)
    closeModal()
  }
}

const renderEventContent = (eventInfo) => {
  const level = eventInfo.event.extendedProps?.calendar || 'primary'
  const colorClass = `fc-bg-${level}`
  return {
    html: `
      <div class="event-fc-color flex fc-event-main ${colorClass} p-1 rounded-sm">
        <div class="fc-daygrid-event-dot"></div>
        <div class="fc-event-time">${eventInfo.timeText}</div>
        <div class="fc-event-title">${eventInfo.event.title}</div>
      </div>
    `,
  }
}

const calendarOptions = computed(() => ({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  headerToolbar: {
    left: 'prev,next addEventButton',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek,timeGridDay',
  },
  events: events.value,
  selectable: true,
  select: handleDateSelect,
  eventClick: handleEventClick,
  eventContent: renderEventContent,
  locale: locale.value,
  direction: isFa.value ? 'rtl' : 'ltr',
  customButtons: {
    addEventButton: {
      text: `${t('calendar.toolbar.addEvent')} +`,
      click: openModal,
    },
  },
}))
</script>
