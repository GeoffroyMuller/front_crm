<template>
  <Card :title="title || ''" class="toast" :class="`toast-${type}`">
    <div class="toast-content">
      <div class="message-container">
        <Icon :name="icon" :color="type" />
        <span v-html="message" />
      </div>

      <Icon @click="$emit('close')" name="close" :color="type" class="icon" />
    </div>
  </Card>
</template>
<script setup lang="ts">
import { computed } from "vue";
import Card from "./Card.vue";
import Icon from "./Icon.vue";
import type { Notification } from "./types";
interface ToastProps {
  type: Notification["type"];
  message: Notification["message"];
  title: Notification["title"];
}

const icon = computed(() => {
  switch (props.type) {
    case "success":
      return "check";
    case "danger":
      return "exclamation";
    default:
      return "exclamation";
  }
});

const props = withDefaults(defineProps<ToastProps>(), {});
</script>

<style lang="scss">
.toast {
  .toast-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .message-container {
    display: flex;
    gap: spacing(1);
    align-items: center;
  }
  .icon {
    cursor: pointer;
    margin-left: spacing(2);
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
