<template>
  <ThemeProvider>
    <SidebarProvider>
      <RouterView />
    </SidebarProvider>
  </ThemeProvider>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import ThemeProvider from './components/layout/ThemeProvider.vue'
import SidebarProvider from './components/layout/SidebarProvider.vue'

const route = useRoute()
const { t, locale } = useI18n({ useScope: 'global' })

const updateDocumentTitle = () => {
  const titleKey = route.meta.titleKey as string | undefined
  const title = titleKey ? t(titleKey) : t('common.app.name')
  document.title = t('routes.documentTitle', { title })
}

watch([() => route.meta.titleKey, locale], updateDocumentTitle, { immediate: true })
</script>
