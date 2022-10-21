<template>
  <span :class="classes">
    {{ name }}
  </span>
</template>

<script lang="ts" setup>
import { withDefaults, defineProps, computed } from "vue";
import type { Color, IconName, Size } from "./types";

interface IconProps {
  name: IconName;
  color?: Color;
  sharp?: boolean;
  size?: Size;
}

const classes = computed(() => {
  const res = [`icon-${props.size}`];
  if (!props.sharp) {
    res.push("material-symbols-outlined");
  } else {
    res.push("material-symbols-sharp");
  }
  return res;
});

const props = withDefaults(defineProps<IconProps>(), {
  color: "black",
  sharp: false,
  size: "md",
});
</script>

<style lang="scss">
.icon-sm {
  font-size: 16px;
}
.icon-md {
  font-size: 20px;
}
.icon-lg {
  font-size: 24px;
}
.icon-xl {
  font-size: 30px;
}
</style>
