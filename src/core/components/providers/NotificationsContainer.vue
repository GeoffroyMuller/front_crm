<template>
  <div class="notifications-container">
    <Toast
      v-for="notification of notifications"
      :key="notification.id"
      v-bind="notification"
      @close="deleteNotification(notification.id as string)"
    />
  </div>
  <slot />
</template>

<script setup lang="ts">
import { ref, provide } from "vue";
import type { Notification } from "../types";
import { uniqueId } from "lodash";
import Toast from "../Toast.vue";

const notifications = ref<Notification[]>([]);

function createNotification(n: Notification | string) {
  const defaultNotification: Notification = {
    type: "primary",
    title: "",
    autoClose: true,
    duration: 2000,
    id: uniqueId(),
    message: "",
  };

  const notification: Notification =
    typeof n === "string"
      ? ({ ...defaultNotification, message: n } as Notification)
      : { ...defaultNotification, ...n };

  notifications.value.push(notification);

  if (notification.autoClose) {
    setTimeout(
      () => deleteNotification(notification.id as string),
      notification.duration
    );
  }
}

function deleteNotification(id: string | number) {
  notifications.value = notifications.value.filter(
    (notification) => notification.id != id
  );
}

provide("notifications", createNotification);
</script>

<style lang="scss">
.notifications-container {
  position: fixed;
  z-index: 50;
  position: absolute;
  bottom: 0;
  right: 0;
  min-width: 400px;
  width: max-content;
  > * {
    margin: spacing(2);
  }
}
</style>
