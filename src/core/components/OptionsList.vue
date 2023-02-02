<template>
  <Card :withPadding="false">
    <template v-if="option">
      <component
        :is="option"
        v-for="opt of _opt"
        :key="getOptionValue(opt)"
        @click.stop="handleClickOption(opt)"
        :option="opt"
        :selected="isSelected(opt)"
      ></component>
    </template>
    <template v-else>
      <div
        class="select-option"
        :class="{
          selected: isSelected(opt),
        }"
        v-for="opt of _opt"
        :key="getOptionValue(opt)"
        @click.stop="handleClickOption(opt)"
      >
        <Checkbox :modelValue="isSelected(opt)" v-if="multiple" />
        {{ getOptionLabel(opt) }}
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { computed, isRef, type Component, type Ref } from "vue";
import Card from "./Card.vue";
import Checkbox from "./form/Checkbox.vue";

interface OptionsListProps {
  getOptionValue: (opt: any) => any;
  getOptionLabel: (opt: any) => string;
  handleClickOption: (opt: any) => void;
  isSelected: (opt: any) => boolean;
  options: Array<any> | Ref<Array<any>>;
  option?: Component;
  multiple?: boolean;
}

const props = withDefaults(defineProps<OptionsListProps>(), {});

const _opt = isRef(props.options)
  ? computed(() => (props.options as Ref).value)
  : props.options;
</script>

<style lang="scss" scoped>
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
