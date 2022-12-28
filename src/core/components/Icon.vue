<template>
  <span class="icon" :class="classes">
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
  const res = [];
  if (!props.sharp) {
    res.push("material-symbols-outlined");
  } else {
    res.push("material-symbols-sharp");
  }
  res.push(`icon-${props.size}`);
  res.push(`icon-${props.color}`);
  return res;
});

const props = withDefaults(defineProps<IconProps>(), {
  color: "black",
  sharp: false,
  size: "md",
});
</script>

<style lang="scss">
.icon {
  transition: color 0.15s ease;
}

.icon-sm {
  font-size: 20px !important;
}
.icon-md {
  font-size: 22px !important;
}
.icon-lg {
  font-size: 24px !important;
}
.icon-xl {
  font-size: 26px !important;
}

@each $key, $value in $colors {
  @if type-of($value) == "map" {
    .icon-#{$key} {
      color: map-deep-get($value, 500);
    }
  }
}
</style>
