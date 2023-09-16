<template>
  <div
    class="overflow-hidden w-[400px] fixed bottom-0 pb-4 max-xl:left-1/2 transform max-xl:-translate-x-1/2 xl:right-4 flex flex-col gap-4 justify-end items-end z-[9999]"
  >
    <TransitionGroup name="toast">
      <Toast
        v-for="notification of notifications"
        :key="notification.id"
        :id="notification.id"
        :title="notification.title"
        :type="notification.type"
        :message="notification.message"
        @close="deleteNotification(notification.id as string)"
      />
    </TransitionGroup>
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
    type: "info",
    title: "",
    autoClose: true,
    duration: 5000,
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
provide("deleteNotification", deleteNotification);
</script>

<style lang="scss">
.toast-enter-active {
  transition: transform 0.5s ease, opacity 0.4s;
}
.toast-leave-active {
  transition: transform 0.5s ease, opacity 0.2s;
}

.toast-enter-from {
  transform: translateY(100%);
  opacity: 0;
}
.toast-leave-to {
  opacity: 0;
  transform: translateY(-100%);
}
</style>
