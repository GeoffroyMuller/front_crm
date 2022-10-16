<template>
  <span
    :class="{
      'material-symbols-outlined': outlined,
      'material-symbols-sharp': !outlined,
    }"
  >
    {{ name }}
  </span>
</template>

<script lang="ts" setup>
import { withDefaults, defineProps } from "vue";
import type { Color, IconName } from "./types";

interface IconProps {
  name: IconName;
  color?: Color;
  outlined?: boolean;
}

const props = withDefaults(defineProps<IconProps>(), {
  color: "black",
  outlined: true,
});
</script>

<style lang="scss"></style>
