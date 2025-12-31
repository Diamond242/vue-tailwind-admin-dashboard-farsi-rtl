<template>
  <div class="min-h-screen xl:flex">
    <app-sidebar />
    <Backdrop />
    <div
      class="flex-1 transition-all duration-300 ease-in-out"
      :class="[contentOffsetClass]"
    >
      <app-header />
      <div class="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import AppSidebar from './AppSidebar.vue'
import AppHeader from './AppHeader.vue'
import { useSidebar } from '@/composables/useSidebar'
import Backdrop from './Backdrop.vue'
import { useI18n } from 'vue-i18n'
const { isExpanded, isHovered } = useSidebar()
const { locale } = useI18n({ useScope: 'global' })

const contentOffsetClass = computed(() => {
  const isRtl = locale.value === 'fa'
  if (isExpanded.value || isHovered.value) {
    return isRtl ? 'lg:mr-[290px]' : 'lg:ml-[290px]'
  }
  return isRtl ? 'lg:mr-[90px]' : 'lg:ml-[90px]'
})
</script>
