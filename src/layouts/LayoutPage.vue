<template>
  <div class="mobile-layout">
    <div class="mobile-nav">
      <IconButton name="menu" @click.stop="mobileNavOpen = true" />
      <Menu>
        <template #activator>
          <Avatar color="primary" size="sm">
            {{ user.firstname?.[0] || "" }}{{ user.lastname?.[0] || "" }}
          </Avatar>
        </template>
        <template #content>
          <AccountActions />
        </template>
      </Menu>

      <Sidebar v-model:open="mobileNavOpen">
        <div class="mobile-nav-items-container">
          <div class="mobile-nav-items">
            <Tree :list="menu" class="tree-menu" default-open>
              <template #item-rollable="{ data, isOpen }">
                <div class="tree-items">
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
                  class="tree-items"
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
        </div>
      </Sidebar>
    </div>
    <slot />
  </div>
  <div class="desktop-layout" id="container" :class="{ 'mini-nav': isNavMini }">
    <div class="nav">
      <div class="logo-container">
        <span v-if="!isNavMini"> CRM </span>
        <IconButton
          @click="isNavMini = !isNavMini"
          :name="!isNavMini ? 'chevron_left' : 'menu'"
        />
      </div>
      <Tree :list="menu" class="tree-menu" :isHidden="isNavMini" default-open>
        <template #item-rollable="{ data, isOpen }">
          <div class="tree-items" v-if="!isNavMini">
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
            v-else
            @click="($e) => iconMiniClick($e, isOpen, data)"
          >
            <Icon :name="data.icon" color="black" />
          </div>
        </template>
        <template #item="{ data }">
          <div class="tree-items" @click="$router.push(data.path)">
            <Icon :name="data.icon" color="black" />
            <div v-if="!isNavMini">{{ $t(data.title) }}</div>
          </div>
        </template>
      </Tree>

      <div class="footer"></div>
    </div>
    <div class="page-container">
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import Icon from "@/core/components/Icon.vue";
import Button from "@/core/components/Button.vue";
import { useUserStore } from "@/stores/user";
import { useRouter } from "vue-router";
import IconButton from "@/core/components/IconButton.vue";
import useUI from "@/core/helpers/vue/composables/ui";
import Avatar from "@/core/components/Avatar.vue";
import Sidebar from "@/core/components/Sidebar.vue";
import type { IconName } from "@/core/components/types";
import { useI18n } from "vue-i18n";
import Tree from "@/core/components/Tree.vue";
import AccountActions from "@/components/AccountActions.vue";
import Menu from "@/core/components/Menu.vue";

const userStore = useUserStore();

const isNavMini = ref(false);
const mobileNavOpen = ref(false);

const router = useRouter();
const { confirm } = useUI();
const { t } = useI18n();

const menu = ref([
  {
    key: "home",
    path: "/",
    title: "home",
    icon: "home",
  },
  {
    key: "events",
    title: "menu.events",
    icon: "calendar_month",
    path: "/events",
  },
  /* {
    key: "billing",
    title: "menu.billing",
    icon: "description",
    path: "/quotes",
    children: [
      {
        key: "quotes",
        path: "/quotes",
        title: "quotes",
        icon: "description",
      },
      {
        key: "invoices",
        path: "/invoices",
        title: "invoices",
        icon: "request_quote",
      },
    ],
  }, */
  {
    key: "quotes",
    path: "/quotes",
    title: "quotes",
    icon: "description",
  },
  {
    key: "invoices",
    path: "/invoices",
    title: "invoices",
    icon: "request_quote",
  },
  {
    key: "products",
    path: "/products",
    title: "products",
    icon: "inventory_2",
  },
  {
    key: "sales",
    path: "/sales",
    title: "sales",
    icon: "sell",
  },
  {
    key: "customers",
    path: "/customers",
    title: "customers",
    icon: "person",
  },
]);

const user = computed(() => userStore.getAuth);

function iconMiniClick(event: Event, isOpen: boolean, data: any) {
  if (isOpen) {
    event.stopPropagation();
  }
  if (data.path) {
    router.push(data.path);
  }
  isNavMini.value = false;
}
</script>

<style lang="scss" scoped>
//mobile
@include media-down(md) {
  .mobile-layout {
    display: block;
  }
  .desktop-layout {
    display: none;
  }
}
//desktop
@include media-up(md) {
  .mobile-layout {
    display: none;
  }
  .desktop-layout {
    display: flex;
  }
}

.mobile-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: spacing(1) spacing(2);
  background-color: color("white");
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
}
.mobile-nav-items-container {
  display: grid;
  place-items: center;
  height: 100%;
  .mobile-nav-items {
    display: flex;
    flex-direction: column;
    gap: spacing(2.5);
    align-items: flex-start;
    justify-content: center;
    .mobile-nav-item {
      display: flex;
      align-items: flex-end;
      gap: spacing(0.5);
    }
  }
}

$navWidth: 240px;
$miniNavWidth: 60px;

.mini-nav {
  .page-menu {
    margin-left: $miniNavWidth;
  }
  .page-container {
    left: $miniNavWidth;
    width: calc(100% - $miniNavWidth);
  }
  .nav {
    width: $miniNavWidth;
  }
}
.loading {
  position: absolute;
  top: 50%;
  left: 50%;
  right: 50%;
  bottom: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.desktop-layout {
  flex-wrap: wrap;
}
.page-container {
  position: absolute;
  transition: left 0.3s ease, width 0.3s ease;
  top: 0;
  left: $navWidth;
  width: calc(100% - $navWidth);
  height: 100%;
  overflow-x: auto;
}
.actions {
  display: flex;
  width: 100%;
  justify-content: flex-end;
  align-items: center;
  margin-top: spacing(2);
}

.nav {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  background-color: color("white");
  color: color("black");
  box-shadow: 2px 2px 0px 0px color("zinc", 100);
  width: $navWidth;
  height: 100vh;
  position: fixed;
  transition: width 0.3s ease;

  .footer {
    position: absolute;
    padding: spacing(0.5) spacing(3);
    bottom: 0;
    display: flex;
    width: 100%;
    align-items: center;
    gap: spacing(1.5);
  }
  .logo-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding-left: 20px;
    padding-right: 20px;
    height: spacing(10);
    & span {
      font-weight: 600;
      color: color("primary", 700);
    }
  }
  .nav-items {
    width: 100%;
    .nav-item {
      $paddingX: calc(20px - spacing(1));

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
      @include typo(text2);
      transition: all 0.3s;
      &:hover {
        background-color: color("primary", 100);
        color: color("primary", 700);

        svg {
          fill: color("primary", 700);
        }
      }
    }
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
    @include typo(text2);
    transition: all 0.3s;
    &:hover {
      background-color: color("primary", 100);
      color: color("primary", 700);

      svg {
        fill: color("primary", 700);
      }
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

.mini-nav {
  .footer {
    justify-content: center;
    padding: 0;
    padding-bottom: spacing(0.5);
  }
}
</style>
