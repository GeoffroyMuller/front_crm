<template>
  <Card :title="title || ''" class="toast" :class="`toast-${type}`">
    <div class="toast-content">
      <Icon
        @click="$emit('close')"
        name="multiply"
        :color="type"
        class="icon"
      />
      <span v-html="message" />
    </div>
  </Card>
</template>
<script setup lang="ts">
import Card from "./Card.vue";
import Icon from "./Icon.vue";
import type { Notification } from "./types";
interface ToastProps {
  type: Notification["type"];
  message: Notification["message"];
  title: Notification["title"];
}

const props = withDefaults(defineProps<ToastProps>(), {});
</script>

<style scoped lang="scss">
.toast {
  .toast-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .icon {
    cursor: pointer;
    margin-right: spacing(2);
  }
}

@each $key, $value in $colors {
  @if type-of($value) == "map" {
    .toast-#{$key} {
      background-color: map-deep-get($value, 50);
      color: map-deep-get($value, 500);
      border: 0.1px solid map-deep-get($value, 400);
    }
  }
}
</style>
