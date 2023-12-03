<template>
  <Text
    :class="{
      'bg-slate-100 border border-slate-300 border-solid': price,
    }"
    class="font-semibold p-1 rounded-sm w-fit"
    typo="text1"
  >
    {{ price ? $utils.formatPrice(price) : "-" }}
  </Text>
</template>

<script setup lang="ts">
import Text from "./Text.vue";
defineProps<{ price?: number | null }>();
</script>
