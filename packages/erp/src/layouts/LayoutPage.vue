<template>
  <LayoutSideMenu
    :menu="menu"
    :bottom-menu-item="{
      key: 'settings',
      path: '/settings',
      title: 'settings',
      icon: 'settings',
    }"
  >
    <template #mobile-nav>
      <Flex
        :style="{ height: '100%' }"
        :px="1"
        justify-content="space-between"
        align-items="center"
      >
        <IconButton name="menu" @click.stop="mobileNavOpen = true" />

        <ActionMenu
          :actions="[
            { icon: 'door_open', action: disconnect, title: 'disconnect' },
          ]"
        >
          <Avatar color="primary" size="sm">
            {{ user.firstname?.[0] || "" }}{{ user.lastname?.[0] || "" }}
          </Avatar>
        </ActionMenu>
      </Flex>

      <Sidebar v-model:open="mobileNavOpen">
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
    </template>
    <slot />
  </LayoutSideMenu>
</template>
<script setup lang="ts">
import useUserStore from "@/stores/user";
import ActionMenu from "core/src/components/ActionMenu.vue";
import Avatar from "core/src/components/Avatar.vue";
import Icon from "core/src/components/Icon.vue";
import IconButton from "core/src/components/IconButton.vue";
import Sidebar from "core/src/components/Sidebar.vue";
import Tree from "core/src/components/Tree.vue";
import Flex from "core/src/components/layouts/Flex.vue";
import useUI from "core/src/composables/ui";
import LayoutSideMenu from "core/src/layouts/LayoutSideMenu.vue";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

const userStore = useUserStore();
const user = computed(() => userStore.getAuth);
const router = useRouter();
const { t } = useI18n();

const { confirm } = useUI();

const mobileNavOpen = ref(false);

async function disconnect() {
  if (await confirm(t("sure-disconnect"))) {
    userStore.disconnect();
    router.replace("/login");
  }
}

const menu = [
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
    key: "reservations",
    path: "/reservations",
    title: "reservations",
    icon: "post_add",
  },
  {
    key: "customers",
    path: "/customers",
    title: "customers",
    icon: "person",
  },
];
</script>

<style lang="scss" scoped>
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
