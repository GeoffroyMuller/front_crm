<template>
  <header
    class="flex justify-between items-center w-full bg-header h-headerHeight px-4 fixed top-0 left-0 z-header"
  >
    <div class="flex items-center gap-3">
      <IconButton
        @click="toggleNavMini()"
        name="menu"
        v-tooltip="{
          text: $t('keyboardshortcuts.ctrl+b'),
          placement: 'right',
          alignment: 'center',
        }"
        color="white"
      />
    </div>

    <div class="flex gap-4 items-center justify-end text-white">
      <slot name="header-right" />
    </div>
  </header>
  <div class="md:flex w-full h-screenMinusHeaderHeight mt-headerHeight">
    <div
      class="md:hidden fixed top-0 left-0 w-screen h-screen z-10"
      @click="isNavMini = true"
      v-if="!isNavMini"
    />
    <nav
      class="flex flex-col justify-between bg-white py-2 transition-all h-full shadow-nav z-nav max-md:fixed max-md:top-headerHeight left-0 max-md:overflow-hidden select-none"
      :class="{
        'w-60': !isNavMini,
        'w-16 max-md:w-0': isNavMini,
      }"
    >
      <Tree :list="menu" class="tree-menu" :isHidden="isNavMini" default-open>
        <template #item-rollable="{ data, isOpen }">
          <div
            class="tree-items"
            tabindex="0"
            :class="{ selected: isItemSelected(data) }"
            v-if="!isNavMini"
          >
            <Icon
              name="arrow_right"
              class="icons-arrow"
              :class="{ active: isOpen }"
              color="black"
            />
            <div>{{ $t(data.title) }}</div>
          </div>
          <Menu
            placement="right"
            v-else
            contentCardClass="layout-sidebar-menu-mini"
            open-on-hover
            strategy="absolute"
          >
            <template #activator>
              <div
                class="tree-items"
                tabindex="0"
                :class="{ selected: isItemSelected(data) }"
              >
                <Icon :name="data.icon" color="black" />
              </div>
            </template>
            <template #content>
              <div class="tree-menu-mini">
                <div class="item-title">
                  {{ data.title }}
                </div>
                <Tree :list="data.children" @click.stop>
                  <template #item-rollable="{ data: d, isOpen }">
                    <div class="item">
                      <Icon
                        name="arrow_right"
                        class="icons-arrow"
                        :class="{ active: isOpen }"
                        color="black"
                      />
                      <div>{{ $t(d.title) }}</div>
                    </div>
                  </template>
                  <template #item="{ data: d }">
                    <div
                      class="item"
                      tabindex="0"
                      @keyup.enter="$router.push(d.path)"
                      :class="{ selected: isItemSelected(d) }"
                      @click="$router.push(d.path)"
                    >
                      <Icon :name="d.icon" color="black" />
                      <div>{{ $t(d.title) }}</div>
                    </div>
                  </template>
                </Tree>
              </div>
            </template>
          </Menu>
        </template>
        <template #item="{ data }">
          <TreeItem
            :display-label="!isNavMini"
            :icon="data.icon"
            :label="$t(data.title)"
            @click="$router.push(data.path)"
            :selected="isItemSelected(data)"
            :tooltip="$t(data.title)"
          />
        </template>
      </Tree>

      <TreeItem
        v-if="bottomMenuItem != null"
        :display-label="!isNavMini"
        :icon="bottomMenuItem.icon"
        :label="$t(bottomMenuItem.title)"
        @click="$router.push((bottomMenuItem as MenuItem).path)"
        :selected="
          isItemSelected({
            path: bottomMenuItem.path,
            key: '',
            title: '',
            icon: 'function',
          })
        "
        full-width
        class="-mb-2"
        :tooltip="$t(bottomMenuItem.title)"
      />
    </nav>
    <div class="flex-1 overflow-hidden h-full z-10">
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
import Icon from "../../components/Icon.vue";
import IconButton from "../../components/IconButton.vue";
import Tree from "../../components/Tree.vue";
import useKeyboardShortcut from "../../composables/keyboardshortcut";
import { useRoute, useRouter } from "vue-router";
import Menu from "../../components/Menu.vue";
import { provide } from "vue";
import type { LayoutSideMenuProvide, MenuItem } from "../types";
import useLocalStorage from "../../composables/localStorage";
import useBreakpoints from "../../composables/breakpoints";
import TreeItem from "./TreeItemTooltip.vue";
import Button from "../../components/Button.vue";

interface LayoutSideMenuProps {
  menu: MenuItem[];
  bottomMenuItem?: MenuItem;
}

const props = withDefaults(defineProps<LayoutSideMenuProps>(), {});

const isNavMini = useLocalStorage("is-nav-mini", false);
const toggleNavMini = () => (isNavMini.value = !isNavMini.value);

const router = useRouter();
const route = useRoute();
const breakpoints = useBreakpoints();

useKeyboardShortcut("mod+b", (e) => {
  isNavMini.value = !isNavMini.value;
});

function isItemSelected(data: MenuItem) {
  if (typeof data.path === "string") {
    return data.path === route.path || route.path.includes(data.path);
  }
  return (
    data.path.name === route.name ||
    ((route?.name as string)?.includes &&
      (route.name as string).includes(data.path.name))
  );
}

provide<LayoutSideMenuProvide>("LayoutSideMenu", {
  isNavMini: isNavMini,
  toggleNavMini,
});
</script>

<style>
.tree-items {
  @apply flex items-center gap-3 py-2 hover:bg-primary-50 px-3 mx-2 rounded-sm cursor-pointer min-h-[38px];
}
.tree-items .icon {
  @apply text-slate-600;
}

.tree-items.selected .icon,
.tree-items:hover .icon {
  @apply text-primary-400;
}

/* .tree-menu::before {
  @apply bg-primary-400 w-[1.5px] absolute;
  height: var(--selected-height, 0);
  top: var(--selected-top, 0);
  content: " ";
} */
</style>
