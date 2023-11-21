<template>
  <div
    :class="{
      'mx-2': !fullWidth,
    }"
  >
    <div
      class="flex items-center gap-3 py-2 hover:bg-primary-50 hover:text-primary-500 cursor-pointer min-h-[38px] text-slate-600"
      :class="{
        '!text-primary-500': selected,
        'px-3 rounded-sm': !fullWidth,
        'px-5': fullWidth,
      }"
      @click="$emit('click')"
      tabindex="0"
      @keyup.enter="$emit('click')"
    >
      <Icon
        :name="icon"
        color="black"
        :sharp="selected"
        transition
        class=""
        :class="{
          'text-primary-400': selected,
        }"
      />
      <div v-if="displayLabel">{{ label }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IconName } from "../../components/types";
import Icon from "../../components/Icon.vue";

export interface TreeItemProps {
  selected: boolean;
  displayLabel?: boolean;
  label?: string;
  icon: IconName;
  fullWidth?: boolean;
}

defineProps<TreeItemProps>();
defineEmits(["click"]);
</script>
