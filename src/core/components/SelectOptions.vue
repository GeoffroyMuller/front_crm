<template>
  <slot
    v-if="$slots.default"
    :isSelected="isSelected"
    :select="(opt: any) => $emit('select', opt)"
    :options="options"
  />
  <div
    v-else
    :class="{
      selected: isSelected(opt) && !$slots.option,
      'select-option': !$slots.option,
    }"
    v-for="opt of options"
    :key="getOptionValue(opt)"
    @click.stop="$emit('select', opt)"
  >
    <template v-if="!$slots.option">
      <Checkbox :modelValue="isSelected(opt)" v-if="multiple" />
      {{ getOptionLabel(opt) }}
    </template>
    <slot v-else name="option" :option="opt" :selected="isSelected(opt)" />
  </div>
</template>

<script setup lang="ts">
import type { Ref } from "vue";
import Checkbox from "./form/Checkbox.vue";

interface SelectOptionsProps {
  getOptionValue: (opt: any) => any;
  getOptionLabel: (opt: any) => string;
  isSelected: (opt: any) => boolean;
  options: Array<any> | Ref<Array<any>>;
  multiple?: boolean;
}

const props = withDefaults(defineProps<SelectOptionsProps>(), {});
</script>

<style lang="scss">
.select-option {
  cursor: pointer;
  padding: spacing(0.75) spacing(1);
  display: flex;
  align-items: center;
  gap: spacing(1);
  &.selected {
    color: color("primary", 500);
  }
  &:hover {
    background-color: color("primary", 50);
    color: color("primary", 500);
  }
  &:last-child {
    border-radius: 0 0 map-get($rounded, md) map-get($rounded, md);
  }
  &:first-child {
    border-radius: map-get($rounded, md) map-get($rounded, md) 0 0;
  }
}
</style>
