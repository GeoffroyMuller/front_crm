<template>
  <div
    :class="`w-fit relative bg-slate-800 text-white px-4 py-3 rounded-md flex items-center gap-4 before:content-[''] before:bg-${color}-500 before:absolute before:h-full before:w-1 before:rounded-md  before:top-0 before:left-0 overflow-hidden`">
    <Icon :name="icon" size="sm" :class="`text-${color}-500`" />
    <div>
      <div class="font-semibold text-md">
        {{ title }}
      </div>
      <div class="text-sm">
        {{ message }}
      </div>
    </div>
    <Icon name="close" size="sm" :class="`text-white cursor-pointer hover:text-${color}-500 rounded-full`" @click="() => {
        if (deleteNotification) {
          deleteNotification(props.id);
        }
      }" />
  </div>
</template>
<script setup lang="ts">
import { computed, inject } from "vue";
import Icon from "./Icon.vue";
import type { Color, IconName, Notification } from "./types";
interface ToastProps {
  type: Notification["type"];
  message: Notification["message"];
  title: Notification["title"];
  id: Notification["id"];
}

const deleteNotification = inject<(id: Notification['id']) => void>("deleteNotification");

const icon = computed<IconName>(() => {
  switch (props.type) {
    case "success":
      return "check";
    case "danger":
      return "dangerous";
    case "warning":
      return "warning";
    default:
      return "info";
  }
});

const color = computed<Color>(() => {
  switch (props.type) {
    case "success":
      return "success";
    case "danger":
      return "danger";
    case "warning":
      return "warning";
    default:
      return "primary";
  }
});

const props = withDefaults(defineProps<ToastProps>(), {});
</script>