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
    <template #mobile-nav="{ setMobileNavOpen }">
      <Flex
        full-height
        :px="1"
        justify-content="space-between"
        align-items="center"
      >
        <IconButton name="menu" @click.stop="setMobileNavOpen(true)" />

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
import LayoutSideMenu, {
  type MenuItem,
} from "core/src/layouts/LayoutSideMenu.vue";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

const userStore = useUserStore();
const user = computed(() => userStore.getAuth);
const router = useRouter();
const { t } = useI18n();

const { confirm } = useUI();

async function disconnect() {
  if (await confirm(t("sure-disconnect"))) {
    userStore.disconnect();
    router.replace("/login");
  }
}

const menu = ref<MenuItem[]>([
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
]);
</script>
