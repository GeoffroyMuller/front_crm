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
    <template #header-right>
      <ActionMenu
        :actions="[
          {
            icon: 'description',
            action: () =>
              router.push({ name: 'quotes-id', params: { id: 'new' } }),
            title: 'add-menu.add-quote',
          },
        ]"
        placement="bottom"
        alignment="end"
      >
        <IconButton color="white" name="add" size="lg" />
      </ActionMenu>
      <ActionMenu
        :actions="[
          {
            icon: 'settings',
            action: () => router.push({ name: 'settings' }),
            title: 'settings',
          },
          { icon: 'door_open', action: disconnect, title: 'disconnect' },
        ]"
        placement="bottom"
        alignment="end"
      >
        <Avatar color="primary" class="cursor-pointer">
          {{ auth.firstname ? auth.firstname.toUpperCase()[0] : ""
          }}{{ auth.lastname ? auth.lastname.toUpperCase()[0] : "" }}
        </Avatar>
      </ActionMenu>
    </template>
    <slot />
  </LayoutSideMenu>
</template>
<script setup lang="ts">
import useUserStore from "@/stores/user";
import ActionMenu from "core/src/components/ActionMenu.vue";
import Avatar from "core/src/components/Avatar.vue";
import IconButton from "core/src/components/IconButton.vue";
import useUI from "core/src/composables/ui";
import LayoutSideMenu from "core/src/layouts/layout_side_menu/LayoutSideMenu.vue";
import type { MenuItem } from "core/src/layouts/types";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

const userStore = useUserStore();
const user = computed(() => userStore.getAuth);
const router = useRouter();
const { t } = useI18n();

const auth = computed(() => {
  return userStore.getAuth;
});

const { confirm } = useUI();

async function disconnect() {
  if (
    await confirm({
      message: t("sure-disconnect"),
      type: "info",
      actions: [
        {
          action: "cancel",
          label: t("cancel"),
          buttonProps: {
            color: "black",
            variant: "text",
          },
        },
        {
          action: "confirm",
          label: t("disconnect"),
          buttonProps: {
            color: "primary",
          },
        },
      ],
    })
  ) {
    userStore.disconnect();
    router.replace("/login");
  }
}

const menu = ref<MenuItem[]>([
  {
    key: "home",
    path: { name: "home" },
    title: "home",
    icon: "home",
  },
  /* {
    key: "test",
    path: { name: "test" },
    title: "Test",
    icon: "home",
    children: [
      {
        key: "events",
        title: "menu.calendar",
        icon: "calendar_month",
        path: { name: "events" },
      },
      {
        key: "quotes",
        path: { name: "quotes" },
        title: "quotes",
        icon: "description",
        children: [
          {
            key: "events",
            title: "menu.calendar",
            icon: "calendar_month",
            path: { name: "events" },
          },
          {
            key: "quotes",
            path: { name: "quotes" },
            title: "quotes",
            icon: "description",
          },
        ],
      },
    ],
  }, */
  {
    key: "events",
    title: "menu.calendar",
    icon: "calendar_month",
    path: { name: "events" },
  },
  {
    key: "quotes",
    path: { name: "quotes" },
    title: "quotes",
    icon: "description",
  },
  {
    key: "invoices",
    path: { name: "invoices" },
    title: "invoices",
    icon: "request_quote",
  },
  {
    key: "products",
    path: { name: "products" },
    title: "products",
    icon: "inventory_2",
  },
  {
    key: "reservations",
    path: { name: "reservations" },
    title: "reservations",
    icon: "event",
  },
  {
    key: "customers",
    path: { name: "customers" },
    title: "customers",
    icon: "person",
  },
]);
</script>
