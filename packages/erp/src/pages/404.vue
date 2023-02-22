<template>
  <div class="page-404">
    <div class="text-container">
      {{ $t("page-not-found") }}
      <Button variant="text" icon="chevron_left" @click="$router.go(-1)">
        {{ $t("back") }}
      </Button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Button from "core/src/components/Button.vue";
</script>

<style lang="scss" scoped>
.page-404 {
  display: grid;
  place-items: center;
  height: 100vh;
  position: relative;
  .text-container {
    display: grid;
    place-items: center;
  }
}
</style>
