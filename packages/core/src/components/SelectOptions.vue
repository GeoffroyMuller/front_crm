<template>
  <slot
    v-if="$slots.default"
    :isSelected="isSelected"
    :select="(opt: any) => $emit('select', opt)"
    :isActive="isActive"
    :options="options"
  />
  <div
    v-else
    :class="{
      selected: isSelected(opt) && !$slots.option,
      active: isActive(index) && !$slots.option,
      'select-option': !$slots.option,
    }"
    v-for="(opt, index) of options"
    :key="getOptionValue(opt)"
    @click.stop="$emit('select', opt)"
  >
    <template v-if="!$slots.option">
      <Checkbox :modelValue="isSelected(opt)" v-if="multiple" />
      {{ getOptionLabel(opt) }}
    </template>
    <slot
      v-else
      name="option"
      :option="opt"
      :active="isActive(index)"
      :selected="isSelected(opt)"
    />
  </div>
</template>

<script setup lang="ts">
import Checkbox from "./form/Checkbox.vue";

interface SelectOptionsProps {
  getOptionValue: (opt: any) => any;
  getOptionLabel: (opt: any) => string;
  isSelected: (opt: any) => boolean;
  options: Array<any>;
  multiple?: boolean;
  isActive: (index: number) => boolean;
}

const props = withDefaults(defineProps<SelectOptionsProps>(), {});
const emit = defineEmits(["select"]);
</script>

<style lang="scss">
.select-option {
  cursor: pointer;
  @apply py-1.5 px-2 gap-2;
  display: flex;
  align-items: center;
  &.selected {
    color: color("primary", 500);
  }
  &:hover,
  &.active {
    background-color: color("primary", 50);
    color: color("primary", 500);
  }
}
</style>
