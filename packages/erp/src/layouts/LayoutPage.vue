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
    <slot />
  </LayoutSideMenu>
</template>
<script setup lang="ts">
import LayoutSideMenu from "core/src/layouts/LayoutSideMenu.vue";

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
