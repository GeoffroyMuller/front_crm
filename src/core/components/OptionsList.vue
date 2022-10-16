<template>
  <div
    class="select-option"
    :class="{
      selected: isSelected(opt),
    }"
    v-for="opt of options"
    :key="getOptionValue(opt)"
    @click="handleClickOption(opt)"
  >
    {{ getOptionLabel(opt) }}
  </div>
</template>

<script setup lang="ts">
interface OptionsListProps {
  getOptionValue: (opt: any) => any;
  getOptionLabel: (opt: any) => string;
  handleClickOption: (opt: any) => void;
  isSelected: (opt: any) => boolean;
  options: Array<any>;
}

const props = withDefaults(defineProps<OptionsListProps>(), {});
</script>
