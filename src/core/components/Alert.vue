<template>
  <div class="alert">
    <slot />
  </div>
</template>

<script setup lang="ts">
interface AlertProps {
  error?: string;
}
const props = withDefaults(defineProps<AlertProps>(), {});
</script>

<style lang="scss">
.alert {
  color: color("danger", 500);
}
</style>
