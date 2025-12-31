<template>
  <button
    class="relative flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full hover:text-dark-900 h-11 w-11 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
    :aria-label="t('common.actions.changeLanguage')"
    :title="t('common.actions.changeLanguage')"
    @click.prevent="toggleLocale"
  >
    <span class="text-xs font-semibold">
      {{ currentLocaleLabel }}
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { setLocale, type SupportedLocale } from '@/locales'

const { t, locale } = useI18n({ useScope: 'global' })

const currentLocaleLabel = computed(() => {
  return locale.value === 'fa' ? t('common.language.faShort') : t('common.language.enShort')
})

const toggleLocale = async () => {
  const next = (locale.value === 'fa' ? 'en' : 'fa') as SupportedLocale
  await setLocale(next)
}
</script>
