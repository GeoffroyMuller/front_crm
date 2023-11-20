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
            title: $t('add-menu.add-quote'),
          },
          {
            icon: 'request_quote',
            action: () =>
              router.push({ name: 'invoices-id', params: { id: 'new' } }),
            title: $t('add-menu.add-invoice'),
          },
          {
            icon: 'inventory_2',
            action: () =>
              router.push({ name: 'products-id', params: { id: 'new' } }),
            title: $t('add-menu.add-product'),
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
            icon: 'account_circle',
            title: $t('my-account'),
            action: () => router.push({ name: 'account' }),
          },
          {
            icon: 'settings',
            action: () => router.push({ name: 'settings' }),
            title: $t('settings'),
          },
          {
            icon: 'door_open',
            action: disconnect,
            title: $t('disconnect'),
            color: 'warning',
          },
        ]"
        placement="bottom"
        alignment="end"
      >
        <Avatar
          imgSrc="https://99designs-blog.imgix.net/blog/wp-content/uploads/2016/03/web-images.jpg?auto=format&q=60&w=1600&h=824&fit=crop&crop=faces"
          color="primary"
          selectable
        >
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
import type { IconName } from "core/src/components/types";
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
      type: "warning",
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
            color: "warning",
            icon: "door_open",
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
    key: "customers",
    path: { name: "customers" },
    title: "customers",
    icon: "person",
  },
  {
    key: "projects",
    path: { name: "projects" },
    title: "menu.projects",
    icon: "check_circle" as IconName,
  },
]);
</script>
