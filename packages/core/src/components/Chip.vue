<template>
  <div
    class="chip typo-chip"
    :class="[
      isOutline ? `chip-outline-${color}` : `chip-${color}`,
      {
        '!text-white !border-white': color === 'white',
      },
    ]"
  >
    <Icon :name="icon" class="icon-chip" size="sm" v-if="icon" />
    <span v-if="$slots.default"><slot /></span>
    <span v-else-if="text">{{ text }}</span>
    <IconButton
      v-if="isClosable"
      name="cancel"
      default-colored
      class="ml-2 -my-iconButtonPadding -mr-iconButtonPadding"
      size="sm"
      :color="computedColor"
      darken
      @click="$emit('close')"
    />
  </div>
</template>

<script setup lang="ts">
import Icon from "./Icon.vue";
import type { Color, IconName } from "./types";
import IconButton from "./IconButton.vue";
import { computed } from "vue";

interface ChipProps {
  icon?: IconName;
  text?: string;
  color?: Color;
  isClosable?: boolean;
  isOutline?: boolean;
}
const props = withDefaults(defineProps<ChipProps>(), {
  isClosable: false,
  isOutline: false,
});

const computedColor = computed<Color>(() => {
  return props.color
});
</script>

<style lang="scss" scoped>
.chip {
  @apply flex justify-center items-center h-7;
  border-radius: 50px;
  background-color: rgba(0, 0, 0, 0.08);
  color: rgba(0, 0, 0, 0.87);
  width: max-content;
  padding: 8px 12px;
  line-height: unset;
  @apply bg-slate-100 text-black border border-solid border-slate-300;
}
.icon-chip {
  margin-right: 4px;
}

@each $key, $value in $colors {
  @if type-of($value) == "map" {
    .chip-#{$key} {
      background: color($key, 100);
      border: 1px solid color($key, 300);
      color: color($key, 700);
    }
    .chip-outline-#{$key} {
      border: 1px solid color($key, 500);
      background-color: transparent;
      color: color($key, 500);
      padding: 7px 12px;
    }
  } @else {
    .chip-#{$key} {
      @apply bg-slate-100 text-black border border-solid border-slate-300;
    }

    .chip-outline-#{$key} {
      border: 1px solid rgba(0, 0, 0, 0.25);
      background-color: transparent;
      color: rgba(0, 0, 0, 0.65);
      padding: 7px 12px;
    }
  }
}
</style>
