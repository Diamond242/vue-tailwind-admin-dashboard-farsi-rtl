<template>
  <aside
    :class="[
      'fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-99999 border-gray-200',
      isRtl ? 'right-0 border-l' : 'left-0 border-r',
      {
        'lg:w-[290px]': isExpanded || isMobileOpen || isHovered,
        'lg:w-[90px]': !isExpanded && !isHovered,
        'translate-x-0 w-[290px]': isMobileOpen,
        '-translate-x-full': !isMobileOpen && !isRtl,
        'translate-x-full': !isMobileOpen && isRtl,
        'lg:translate-x-0': true,
      },
    ]"
    @mouseenter="!isExpanded && (isHovered = true)"
    @mouseleave="isHovered = false"
  >
    <div
      :class="[
        'py-8 flex',
        !isExpanded && !isHovered
          ? 'lg:justify-center'
          : isRtl
            ? 'justify-end'
            : 'justify-start',
      ]"
    >
      <router-link to="/">
        <img
          v-if="isExpanded || isHovered || isMobileOpen"
          class="dark:hidden"
          src="/images/logo/logo.svg"
          alt="Logo"
          width="150"
          height="40"
        />
        <img
          v-if="isExpanded || isHovered || isMobileOpen"
          class="hidden dark:block"
          src="/images/logo/logo-dark.svg"
          alt="Logo"
          width="150"
          height="40"
        />
        <img
          v-else
          src="/images/logo/logo-icon.svg"
          alt="Logo"
          width="32"
          height="32"
        />
      </router-link>
    </div>
    <div
      class="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar"
    >
      <nav class="mb-6">
        <div class="flex flex-col gap-4">
          <div v-for="(menuGroup, groupIndex) in menuGroups" :key="groupIndex">
            <h2
              :class="[
                'mb-4 text-xs uppercase flex w-full leading-[20px] text-gray-400 text-left rtl:text-right',
                isExpanded || isHovered || isMobileOpen
                  ? 'justify-start rtl:justify-start'
                  : 'lg:justify-center',
              ]"
            >
              <template v-if="isExpanded || isHovered || isMobileOpen">
                {{ t(menuGroup.titleKey) }}
              </template>
              <HorizontalDots v-else />
            </h2>
            <ul class="flex flex-col gap-4">
              <li v-for="(item, index) in menuGroup.items" :key="item.nameKey">
                <button
                  v-if="item.subItems"
                  @click="toggleSubmenu(groupIndex, index)"
                  :class="[
                    'menu-item group w-full',
                    {
                      'menu-item-active': isSubmenuOpen(groupIndex, index),
                      'menu-item-inactive': !isSubmenuOpen(groupIndex, index),
                    },
                    !isExpanded && !isHovered
                      ? 'lg:justify-center'
                      : isRtl
                        ? 'lg:justify-end'
                        : 'lg:justify-start',
                  ]"
                >
                  <span
                    :class="[
                      isSubmenuOpen(groupIndex, index)
                        ? 'menu-item-icon-active'
                        : 'menu-item-icon-inactive',
                    ]"
                  >
                    <component :is="item.icon" />
                  </span>
                  <span
                    v-if="isExpanded || isHovered || isMobileOpen"
                    class="menu-item-text"
                    >{{ t(item.nameKey) }}</span
                  >
                  <ChevronDownIcon
                    v-if="isExpanded || isHovered || isMobileOpen"
                    :class="[
                      'ml-auto rtl:ml-0 rtl:mr-auto w-5 h-5 transition-transform duration-200',
                      {
                        'rotate-180 text-brand-500': isSubmenuOpen(
                          groupIndex,
                          index
                        ),
                      },
                    ]"
                  />
                </button>
                <router-link
                  v-else-if="item.path"
                  :to="item.path"
                  :class="[
                    'menu-item group',
                    {
                      'menu-item-active': isActive(item.path),
                      'menu-item-inactive': !isActive(item.path),
                    },
                  ]"
                >
                  <span
                    :class="[
                      isActive(item.path)
                        ? 'menu-item-icon-active'
                        : 'menu-item-icon-inactive',
                    ]"
                  >
                    <component :is="item.icon" />
                  </span>
                  <span
                    v-if="isExpanded || isHovered || isMobileOpen"
                    class="menu-item-text"
                    >{{ t(item.nameKey) }}</span
                  >
                </router-link>
                <transition
                  @enter="startTransition"
                  @after-enter="endTransition"
                  @before-leave="startTransition"
                  @after-leave="endTransition"
                >
                  <div
                    v-show="
                      isSubmenuOpen(groupIndex, index) &&
                      (isExpanded || isHovered || isMobileOpen)
                    "
                  >
                    <ul class="mt-2 space-y-1 ml-9 rtl:ml-0 rtl:mr-9">
                      <li v-for="subItem in item.subItems" :key="subItem.nameKey">
                        <router-link
                          :to="subItem.path"
                          :class="[
                            'menu-dropdown-item',
                            {
                              'menu-dropdown-item-active': isActive(
                                subItem.path
                              ),
                              'menu-dropdown-item-inactive': !isActive(
                                subItem.path
                              ),
                            },
                          ]"
                        >
                          {{ t(subItem.nameKey) }}
                          <span class="flex items-center gap-1 ml-auto rtl:ml-0 rtl:mr-auto">
                            <span
                              v-if="subItem.new"
                              :class="[
                                'menu-dropdown-badge',
                                {
                                  'menu-dropdown-badge-active': isActive(
                                    subItem.path
                                  ),
                                  'menu-dropdown-badge-inactive': !isActive(
                                    subItem.path
                                  ),
                                },
                              ]"
                            >
                              {{ t('layout.sidebar.badges.new') }}
                            </span>
                            <span
                              v-if="subItem.pro"
                              :class="[
                                'menu-dropdown-badge',
                                {
                                  'menu-dropdown-badge-active': isActive(
                                    subItem.path
                                  ),
                                  'menu-dropdown-badge-inactive': !isActive(
                                    subItem.path
                                  ),
                                },
                              ]"
                            >
                              {{ t('layout.sidebar.badges.pro') }}
                            </span>
                          </span>
                        </router-link>
                      </li>
                    </ul>
                  </div>
                </transition>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <SidebarWidget v-if="isExpanded || isHovered || isMobileOpen" />
    </div>
  </aside>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";

import {
  GridIcon,
  CalenderIcon,
  UserCircleIcon,
  ChatIcon,
  MailIcon,
  DocsIcon,
  PieChartIcon,
  ChevronDownIcon,
  HorizontalDots,
  PageIcon,
  TableIcon,
  ListIcon,
  PlugInIcon,
} from "../../icons";
import SidebarWidget from "./SidebarWidget.vue";
import BoxCubeIcon from "@/icons/BoxCubeIcon.vue";
import { useSidebar } from "@/composables/useSidebar";

const route = useRoute();

const { isExpanded, isMobileOpen, isHovered, openSubmenu } = useSidebar();

const { t, locale } = useI18n({ useScope: 'global' });
const isRtl = computed(() => locale.value === 'fa');

const menuGroups = [
  {
    titleKey: "layout.sidebar.groups.menu",
    items: [
      {
        icon: GridIcon,
        nameKey: "layout.sidebar.items.dashboard",
        subItems: [{ nameKey: "layout.sidebar.items.ecommerce", path: "/", pro: false }],
      },
      {
        icon: CalenderIcon,
        nameKey: "layout.sidebar.items.calendar",
        path: "/calendar",
      },
      {
        icon: UserCircleIcon,
        nameKey: "layout.sidebar.items.userProfile",
        path: "/profile",
      },

      {
        nameKey: "layout.sidebar.items.forms",
        icon: ListIcon,
        subItems: [
          { nameKey: "layout.sidebar.items.formElements", path: "/form-elements", pro: false },
        ],
      },
      {
        nameKey: "layout.sidebar.items.tables",
        icon: TableIcon,
        subItems: [
          { nameKey: "layout.sidebar.items.basicTables", path: "/basic-tables", pro: false },
        ],
      },
      {
        nameKey: "layout.sidebar.items.pages",
        icon: PageIcon,
        subItems: [
          { nameKey: "layout.sidebar.items.blank", path: "/blank", pro: false },
          { nameKey: "layout.sidebar.items.error404", path: "/error-404", pro: false },
        ],
      },
    ],
  },
  {
    titleKey: "layout.sidebar.groups.others",
    items: [
      {
        icon: PieChartIcon,
        nameKey: "layout.sidebar.items.charts",
        subItems: [
          { nameKey: "layout.sidebar.items.lineChart", path: "/line-chart", pro: false },
          { nameKey: "layout.sidebar.items.barChart", path: "/bar-chart", pro: false },
        ],
      },
      {
        icon: BoxCubeIcon,
        nameKey: "layout.sidebar.items.uiElements",
        subItems: [
          { nameKey: "layout.sidebar.items.alerts", path: "/alerts", pro: false },
          { nameKey: "layout.sidebar.items.avatars", path: "/avatars", pro: false },
          { nameKey: "layout.sidebar.items.badge", path: "/badge", pro: false },
          { nameKey: "layout.sidebar.items.buttons", path: "/buttons", pro: false },
          { nameKey: "layout.sidebar.items.images", path: "/images", pro: false },
          { nameKey: "layout.sidebar.items.videos", path: "/videos", pro: false },
        ],
      },
      {
        icon: PlugInIcon,
        nameKey: "layout.sidebar.items.authentication",
        subItems: [
          { nameKey: "layout.sidebar.items.signin", path: "/signin", pro: false },
          { nameKey: "layout.sidebar.items.signup", path: "/signup", pro: false },
        ],
      },
      // ... Add other menu items here
    ],
  },
];

const isActive = (path) => route.path === path;

const toggleSubmenu = (groupIndex, itemIndex) => {
  const key = `${groupIndex}-${itemIndex}`;
  openSubmenu.value = openSubmenu.value === key ? null : key;
};

const isAnySubmenuRouteActive = computed(() => {
  return menuGroups.some((group) =>
    group.items.some(
      (item) =>
        item.subItems && item.subItems.some((subItem) => isActive(subItem.path))
    )
  );
});

const isSubmenuOpen = (groupIndex, itemIndex) => {
  const key = `${groupIndex}-${itemIndex}`;
  return (
    openSubmenu.value === key ||
    (isAnySubmenuRouteActive.value &&
      menuGroups[groupIndex].items[itemIndex].subItems?.some((subItem) =>
        isActive(subItem.path)
      ))
  );
};

const startTransition = (el) => {
  el.style.height = "auto";
  const height = el.scrollHeight;
  el.style.height = "0px";
  el.offsetHeight; // force reflow
  el.style.height = height + "px";
};

const endTransition = (el) => {
  el.style.height = "";
};
</script>
