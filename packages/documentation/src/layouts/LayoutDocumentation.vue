<template>
  <LayoutSideMenu :menu="menu">
    <template #header-right></template>
    <slot />
  </LayoutSideMenu>
</template>
<script setup lang="ts">
import type { IconName } from "core/src/components/types";
import LayoutSideMenu from "core/src/layouts/layout_side_menu/LayoutSideMenu.vue";
import type { MenuItem } from "core/src/layouts/types";
import { ref } from "vue";

const menu = ref<MenuItem[]>([
  {
    key: "components",
    path: { name: "components" },
    title: "components",
    icon: "build" as IconName,
    children: [
      {
        key: "buttons",
        path: { name: "buttons" },
        title: "buttons",
        icon: "magic_button" as IconName,
      },
    ],
  },
]);
</script>
