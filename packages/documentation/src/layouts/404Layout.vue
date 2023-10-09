<template>
  <component :is="layout">
    <slot />
  </component>
</template>

<script setup lang="ts">
import { getJWT } from "core/src/helpers/utils";
import Default from "./Default.vue";
import LayoutPage from "./LayoutPage.vue";

const layout = getJWT() ? LayoutPage : Default;
</script>
