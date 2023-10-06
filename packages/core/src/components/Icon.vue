<template>
  <span class="icon notranslate" :class="classes">
    {{ name }}
  </span>
</template>

<script lang="ts" setup>
import { withDefaults, computed } from "vue";
import type { Color, IconName, Size } from "./types";

export interface IconProps {
  name: IconName;
  color?: Color;
  sharp?: boolean;
  size?: Size | "xs";
  weight?: "bold" | "normal";

  // TODO : this props exist just for LayoutSideMenu TreeItem selected, not so generic...
  transition?: boolean;
}

const classes = computed(() => {
  const res = [];
  res.push("material-symbols-outlined");
  if (props.sharp) {
    res.push("icon-sharp");
  }
  res.push(`icon-${props.size}`);
  res.push(`icon-${props.color}`);
  res.push(`icon-${props.weight}`);
  if (props.transition) {
    res.push("icon-transition");
  }
  return res;
});

const props = withDefaults(defineProps<IconProps>(), {
  color: "black",
  sharp: false,
  size: "md",
  weight: "normal",
});
</script>

<style lang="scss">
.icon {
  transition: color 0.15s ease;
  background-color: transparent;
  user-select: none;
  font-weight: 400;
  font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 48;
  &.icon-bold {
    font-variation-settings: "FILL" 0, "wght" 700, "GRAD" 0, "opsz" 48;
  }
  &.icon-sharp {
    &.icon-transition {
      @apply transition-[font-variation-settings] duration-200;
    }
    font-variation-settings: "FILL" 1, "wght" 400, "GRAD" 0, "opsz" 48;
    &.icon-bold {
      font-variation-settings: "FILL" 1, "wght" 700, "GRAD" 0, "opsz" 48;
    }
  }
}
.icon-xs {
  font-size: 13px !important;
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
      //color: map-deep-get($value, 500);
      background: linear-gradient(
        245deg,
        map-deep-get($value, 500) 0%,
        map-deep-get($value, 400) 100%
      );
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }
  }
}
.icon-white {
  color: white;
}
</style>
