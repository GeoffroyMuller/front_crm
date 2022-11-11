<template>
  <div
    class="chips"
    :class="isOutline ? `chips-outline-${color}` : `chips-${color}`"
  >
    <Icon :name="icon" class="icon-chips" size="sm" v-if="icon" />
    <span v-if="$slots.default"><slot /></span>
    <span v-else-if="text">{{ text }}</span>
    <IconButton
      v-if="isClosable"
      name="cancel"
      class="icon-btn-cancel"
      size="sm"
      :color="isOutline ? color : color ? 'white' : 'black'"
      @click.stop="$emit('close')"
    />
  </div>
</template>

<script setup lang="ts">
import Icon from "./Icon.vue";
import type { Color, IconName } from "./types";
import IconButton from "./IconButton.vue";

interface ChipsProps {
  icon?: IconName;
  text?: string;
  color?: Color;
  isClosable?: boolean;
  isOutline?: boolean;
}
const props = withDefaults(defineProps<ChipsProps>(), {
  isClosable: false,
  isOutline: false,
});
</script>

<style lang="scss" scoped>
.chips {
  @include flex(row, center, center);
  border-radius: 50px;
  background-color: #e0e0e0;
  color: black;
  width: max-content;
  padding: 8px 15px;
  line-height: unset;
}
.icon-btn-cancel {
  margin-left: 8px;
}
.icon-chips {
  margin-right: 4px;
}

@each $key, $value in $colors {
  @if type-of($value) == "map" {
    .chips-#{$key} {
      background-color: color($key, 500);
      color: white;
    }
    .chips-outline-#{$key} {
      border: 1px solid color($key, 500);
      background-color: white;
      color: color($key, 500);
    }
  }
}
</style>
