<template>
  <div class="relative" ref="dropdownRef">
    <button
      class="flex items-center gap-2 text-gray-700 dark:text-gray-400 rtl:text-right"
      @click.prevent="toggleDropdown"
    >
      <span class="order-1 rtl:order-3 overflow-hidden rounded-full h-11 w-11">
        <img src="/images/user/owner.jpg" alt="User" />
      </span>

      <span class="order-2 block font-medium text-theme-sm">Musharof </span>

      <ChevronDownIcon
        class="order-3 rtl:order-1"
        :class="{ 'rotate-180': dropdownOpen }"
      />
    </button>

    <!-- Dropdown Start -->
    <div
      v-if="dropdownOpen"
      class="absolute right-0 rtl:right-auto rtl:left-0 mt-[17px] flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark rtl:text-right"
    >
      <div>
        <span class="block font-medium text-gray-700 text-theme-sm dark:text-gray-400">
          Musharof Chowdhury
        </span>
        <span class="mt-0.5 block text-theme-xs text-gray-500 dark:text-gray-400">
          randomuser@pimjo.com
        </span>
      </div>

      <ul class="flex flex-col gap-1 pt-4 pb-3 border-b border-gray-200 dark:border-gray-800">
        <li v-for="item in menuItems" :key="item.href">
          <router-link
            :to="item.href"
            class="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300 rtl:flex-row-reverse rtl:justify-end"
          >
            <component
              :is="item.icon"
              class="text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300"
            />
            {{ t(item.textKey) }}
          </router-link>
        </li>
      </ul>
      <router-link
        to="/signin"
        @click="signOut"
        class="flex items-center gap-3 px-3 py-2 mt-3 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300 rtl:flex-row-reverse rtl:justify-end"
      >
        <LogoutIcon
          class="text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300"
        />
        {{ t('layout.header.userMenu.signOut') }}
      </router-link>
    </div>
    <!-- Dropdown End -->
  </div>
</template>

<script setup>
import { UserCircleIcon, ChevronDownIcon, LogoutIcon, SettingsIcon, InfoCircleIcon } from '@/icons'
import { RouterLink } from 'vue-router'
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'

const dropdownOpen = ref(false)
const dropdownRef = ref(null)

const { t } = useI18n({ useScope: 'global' })

const menuItems = [
  { href: '/profile', icon: UserCircleIcon, textKey: 'layout.header.userMenu.editProfile' },
  { href: '/chat', icon: SettingsIcon, textKey: 'layout.header.userMenu.accountSettings' },
  { href: '/profile', icon: InfoCircleIcon, textKey: 'layout.header.userMenu.support' },
]

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value
}

const closeDropdown = () => {
  dropdownOpen.value = false
}

const signOut = () => {
  // Implement sign out logic here
  console.log('Signing out...')
  closeDropdown()
}

const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    closeDropdown()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
