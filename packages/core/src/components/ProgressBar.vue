<template>
  <div class="progress-bar">
    <div
      class="progress"
      :style="{ width: `${progress > 100 ? 100 : progress}%` }"
    ></div>
  </div>
</template>

<script setup lang="ts">
export interface ProgressBarProps {
  progress: number;
}

const props = withDefaults(defineProps<ProgressBarProps>(), {});
</script>

<style lang="scss">
.progress-bar {
  height: 2px;
  background-color: color("primary", 200);
  width: 100%;
  .progress {
    height: inherit;
    background-color: color("primary", 500);
    width: 0;
  }
}
</style>
