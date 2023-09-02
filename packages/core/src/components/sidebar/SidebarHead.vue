<template>
  <div
    class="sticky top-0 left-0 w-full bg-white z-30 border border-slate-200 border-solid border-l-0 border-r-0 border-t-0"
  >
    <div class="flex items-center justify-between px-sidebarX py-1">
      <div class="typo-title2">{{ title }}</div>
      <div class="flex items-center gap-4 justify-end py-2">
        <template
          v-for="(a, index) of actions.filter((a) => a.main)"
          :key="a.title"
        >
          <Button
            :icon="a.icon"
            :color="a.color || 'primary'"
            variant="text"
            @click="() => handleAction(a)"
          >
            <span class="max-lg:hidden">{{ a.title }}</span>
          </Button>
          <div
            v-if="index < actions.filter((a) => a.main).length - 1"
            class="h-[15px] border-primary-200 border-r border-solid border-l-0 max-lg:hidden"
          />
        </template>

        <ActionMenu
          :actions="actions"
          @action="($a) => emit('action', $a)"
          placement="bottom-right"
        >
          <IconButton size="xl" name="more_horiz" default-colored />
        </ActionMenu>
        <IconButton name="close" size="xl" @click="handleClose" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { inject } from "vue";
import ActionMenu, { type Action } from "../ActionMenu.vue";
import Button from "../Button.vue";
import IconButton from "../IconButton.vue";
import type { Color } from "../types";
import type { SidebarInject } from "./sidebar.types";

export type SidebarHeadAction = Action & { main?: boolean; color?: Color };

const emit = defineEmits(["action", "close"]);
defineProps<{ title: string; actions: SidebarHeadAction[] }>();

const sidebar = inject<SidebarInject>("sidebar");

function handleClose() {
  if (sidebar != null) {
    sidebar.close();
  }

  emit("close");
}

function handleAction(a: Action) {
  if (typeof a.action === "string") {
    emit("action", a.action);
  } else {
    a.action();
  }
}
</script>
