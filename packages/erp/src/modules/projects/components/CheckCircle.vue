<template>
  <div
    @click="$emit('update:checked', !checked)"
    :class="{
      'w-7 h-7': size === 'xl',
      'w-5 h-5': size !== 'xl',

      'hover:bg-success-50': !checked,
      'bg-success-400': checked,
    }"
    class="rounded-full border border-slate-200 border-solid grid place-items-center cursor-pointer transition-all aspect-square"
  >
    <Icon
      name="check"
      :size="size === 'xl' ? 'sm' : 'xxs'"
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
