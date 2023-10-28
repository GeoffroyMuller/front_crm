<template>
  <div
    @click="$emit('update:checked', !checked)"
    :class="{
      'w-8 h-8': size === 'xl',
      'w-6 h-6': size !== 'xl',

      'hover:bg-success-50': !checked,
      'bg-gradient-245 from-success-400 to-success-300': checked,
    }"
    class="rounded-full border border-slate-200 border-solid grid place-items-center cursor-pointer transition-all aspect-square"
  >
    <Icon
      name="check"
      :size="size === 'xl' ? 'sm' : 'xs'"
      :color="checked ? 'white' : 'black'"
    />
  </div>
</template>

<script setup lang="ts">
import Icon from "core/src/components/Icon.vue";

defineProps<{
  checked?: boolean;
  size: "sm" | "xl";
}>();

defineEmits(["update:checked"]);
</script>
