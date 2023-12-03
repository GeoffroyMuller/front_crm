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
  size?: Size | "xxs" | "xs" | "3xl";
  weight?: "bold" | "normal";

  // TODO : this props exist just for LayoutSideMenu TreeItem selected, not so generic...
  transition?: boolean;

  darken?: boolean;
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
  if (props.darken) {
    res.push("darken");
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
.icon-xxs {
  font-size: 0.8125rem !important;
}
.icon-xs {
  font-size: 1rem !important;
}
.icon-sm {
  font-size: 1.25rem !important;
}
.icon-md {
  font-size: 1.375rem !important;
}
.icon-lg {
  font-size: 1.5rem !important;
}
.icon-xl {
  font-size: 1.625rem !important;
}
.icon-3xl {
  font-size: 1.7rem !important;
}

@each $key, $value in $colors {
  @if type-of($value) == "map" {
    .icon-#{$key} {
      color: map-deep-get($value, 500);
      &.darken {
        color: map-deep-get($value, 700);
      }
    }
  }
}
.icon-white {
  color: white;
}
</style>
