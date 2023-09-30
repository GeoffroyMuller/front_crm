<template>
  <div
    class="chip typo-chip"
    :class="isOutline ? `chip-outline-${color}` : `chip-${color}`"
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
      :color="isOutline ? color : 'white'"
      @click="$emit('close')"
    />
  </div>
</template>

<script setup lang="ts">
import Icon from "./Icon.vue";
import type { Color, IconName } from "./types";
import IconButton from "./IconButton.vue";

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
</script>

<style lang="scss" scoped>
.chip {
  @apply flex justify-center items-center;
  border-radius: 50px;
  background-color: rgba(0, 0, 0, 0.08);
  color: rgba(0, 0, 0, 0.87);
  width: max-content;
  padding: 8px 12px;
  line-height: unset;
}
.icon-chip {
  margin-right: 4px;
}

@each $key, $value in $colors {
  @if type-of($value) == "map" {
    .chip-#{$key} {
      background: color($key, 500);
      color: color("white");
      background: linear-gradient(
        245deg,
        color($key, 500) 0%,
        color($key, 400) 100%
      );
    }
    .chip-outline-#{$key} {
      border: 1px solid color($key, 500);
      background-color: transparent;
      color: color($key, 500);
    }
  } @else {
    .chip-#{$key} {
      background-color: rgba(0, 0, 0, 0.25);
      color: color("white");
    }
    .chip-outline-#{$key} {
      border: 1px solid rgba(0, 0, 0, 0.25);
      background-color: transparent;
      color: rgba(0, 0, 0, 0.65);
    }
  }
}
</style>
