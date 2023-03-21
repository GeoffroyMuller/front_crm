<template>
  <div class="html-pdf-presenter">
    <div class="content">
      <slot />
    </div>
  </div>
</template>
<script setup lang="ts"></script>

<style lang="scss" scoped>
.html-pdf-presenter {
  padding: spacing(2) spacing(8);
  background-color: color("zinc", 200);
  .content {
    background-color: white;
    border-radius: map-deep-get($rounded, "sm");
    margin: auto;
  }
}
</style>
