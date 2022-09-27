<template>
  <div class="notifications-container">
    <pre v-for="notification of notifications" :key="notification.id">
        {{ notification }}
    </pre>
  </div>
  <slot />
</template>

<script setup lang="ts">
import { ref, provide } from "vue";
import type { Notification } from "../types";
import { uniqueId } from "lodash";

const notifications = ref<Notification[]>([]);

function createNotification(notification: Notification) {
  notification.duration = notification.duration || 5000;
  notification.id = notification.id || uniqueId();
  notifications.value.push(notification);
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
  position: absolute;
  bottom: 0;
  margin: auto;
  left: 0;
  right: 0;
  margin: spacing(1);
}
</style>
