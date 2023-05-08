<template>
  <div class="layout-side-mobile-menu">
    <slot
      name="mobile-nav"
      :setMobileNavOpen="(o: boolean) => (mobileNavOpen = o)"
    />
    <Sidebar v-model:open="mobileNavOpen" position="left">
      <div class="mobile-nav-items-container">
        <Tree :list="menu" class="mobile-nav-items" default-open>
          <template #item-rollable="{ data, isOpen }">
            <div class="mobile-nav-items" tabindex="0">
              <Icon
                name="arrow_right"
                class="icons-arrow"
                :class="{ active: isOpen }"
                color="black"
              />
              <div>{{ $t(data.title) }}</div>
            </div>
          </template>
          <template #item="{ data }">
            <div
              class="mobile-nav-item"
              tabindex="0"
              @keyup.enter="$router.push(data.path)"
              @click="
                mobileNavOpen = false;
                $router.push(data.path);
              "
            >
              <Icon :name="data.icon" color="black" />
              <div>{{ $t(data.title) }}</div>
            </div>
          </template>
        </Tree>
      </div>
    </Sidebar>
  </div>
  <nav class="layout-side-menu" :class="{ mini: isNavMini }">
    <div class="logo-container">
      <span v-if="!isNavMini"> CRM </span>
      <IconButton
        @click="isNavMini = !isNavMini"
        :name="!isNavMini ? 'chevron_left' : 'menu'"
        v-tooltip="{
          text: $t('keyboardshortcuts.ctrl+b'),
          placement: 'right',
        }"
      />
    </div>
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
        <div
          class="tree-items"
          tabindex="0"
          :class="{ selected: isItemSelected(data) }"
          v-else
          @click="($e) => iconMiniClick($e, isOpen, data)"
        >
          <Icon :name="data.icon" color="black" />
        </div>
      </template>
      <template #item="{ data }">
        <div
          class="tree-items"
          tabindex="0"
          @keyup.enter="$router.push(data.path)"
          :class="{ selected: isItemSelected(data) }"
          @click="$router.push(data.path)"
        >
          <Icon :name="data.icon" color="black" />
          <div v-if="!isNavMini">{{ $t(data.title) }}</div>
        </div>
      </template>
    </Tree>

    <div
      v-if="bottomMenuItem != null"
      class="bottom-menu-item"
      :class="{ selected: isItemSelected({ path: bottomMenuItem.path }) }"
      @click="$router.push((bottomMenuItem as MenuItem).path)"
      tabindex="0"
      @keyup.enter="
        {
          if (bottomMenuItem != null) {
            $router.push(bottomMenuItem.path);
          }
        }
      "
    >
      <Icon :name="bottomMenuItem.icon" color="black" />
      <div v-if="!isNavMini">{{ $t(bottomMenuItem.title) }}</div>
    </div>
  </nav>
  <div class="layout-side-page-container" :class="{ 'nav-is-mini': isNavMini }">
    <slot />
  </div>
</template>

<script setup lang="ts">
import Icon from "../components/Icon.vue";
import IconButton from "../components/IconButton.vue";
import Tree from "../components/Tree.vue";
import useKeyboardShortcut from "../composables/keyboardshortcut";
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import Sidebar from "../components/Sidebar.vue";
import { provide } from "vue";
import type { LayoutSideMenuProvide, MenuItem } from "./types";

interface LayoutSideMenuProps {
  menu: MenuItem[];
  bottomMenuItem?: MenuItem;
}

const props = withDefaults(defineProps<LayoutSideMenuProps>(), {});

const isNavMini = ref(false);
const mobileNavOpen = ref(false);

const router = useRouter();
const route = useRoute();

useKeyboardShortcut("mod+b", (e) => {
  isNavMini.value = !isNavMini.value;
});

function iconMiniClick(event: Event, isOpen: boolean, data: any) {
  if (isOpen) {
    event.stopPropagation();
  }
  if (data.path) {
    router.push(data.path);
  }
  isNavMini.value = false;
}

function isItemSelected(data: any) {
  if (data.path === "/") {
    return route.path === "/";
  }
  return route.path.includes(data.path);
}

provide<LayoutSideMenuProvide>("LayoutSideMenu", {
  isNavMini: isNavMini,
});
</script>

<style lang="scss" scoped>
$navWidth: $layoutSideNavWidth;
$miniNavWidth: $layoutSideMiniNavWidth;
$headerHeightMobile: $layoutSideHeaderHeightMobile;

.layout-side-mobile-menu {
  @include media-up(md) {
    display: none;
  }
  width: 100%;
  background-color: color("white");
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  height: $headerHeightMobile;
  position: fixed;
  top: 0;
  z-index: 2;
}
.layout-side-menu {
  &.mini {
    width: $miniNavWidth;
  }
  @include media-down(md) {
    display: none;
  }

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  background-color: color("white");
  color: color("black");
  box-shadow: 0 0 2rem 0 rgba(136, 152, 170, 0.15);
  width: $navWidth;
  height: 100vh;
  position: fixed;
  transition: width 0.3s ease;

  .bottom-menu-item {
    $paddingX: calc(20px);
    position: absolute;
    padding: spacing(1) $paddingX;
    bottom: 0;
    display: flex;
    width: 100%;
    align-items: center;
    gap: spacing(1.5);
    cursor: pointer;
    &.selected {
      color: color("primary", 700);

      svg {
        fill: color("primary", 700);
      }
    }
    &:hover {
      background-color: color("primary", 100);
      color: color("primary", 700);

      svg {
        fill: color("primary", 700);
      }
    }
  }
  .logo-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: spacing(3.5) 20px;
    font-size: 1.3rem;
    & span {
      font-weight: 600;
      color: color("primary", 400);
    }
  }
  .tree-menu {
    width: 100%;
    .tree-items {
      $paddingX: calc(20px - spacing(1));
      height: 38px;
      padding: spacing(1);
      padding-left: $paddingX;
      padding-right: $paddingX;
      margin-left: spacing(1);
      margin-right: spacing(1);
      gap: spacing(2);
      border-radius: 6px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      cursor: pointer;
      user-select: none;
      @include typo(title5);
      transition: all 0.3s;
      &.selected {
        color: color("primary", 500);
      }
      &:hover {
        background-color: color("primary", 50);
        color: color("primary", 500);
      }
      .icons-arrow {
        transition: all 0.2s;
        line-height: 0px;
        &.active {
          transform: rotate(90deg * 1);
        }
      }
    }
  }
}
.layout-side-page-container {
  position: absolute;
  transition: left 0.3s ease, width 0.3s ease;
  top: 0;
  left: $navWidth;
  width: calc(100% - $navWidth);
  height: 100%;
  overflow-y: hidden;
  overflow-x: auto;
  &.nav-is-mini {
    left: $miniNavWidth;
    width: calc(100% - $miniNavWidth);
  }
  @include media-down(md) {
    position: initial;
    left: 0;
    width: 100%;
    height: auto;
    margin-top: $headerHeightMobile;
  }
}
.mobile-nav-items-container {
  display: grid;
  place-items: center;
  height: 100vh;
  .mobile-nav-items {
    display: flex;
    flex-direction: column;
    gap: spacing(1.5);
    align-items: flex-start;
    justify-content: center;
    .mobile-nav-item {
      display: flex;
      align-items: flex-end;
      gap: spacing(0.75);
    }
  }
}
</style>
