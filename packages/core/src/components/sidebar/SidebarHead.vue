<template>
  <div class="sticky top-0 left-0 w-full z-30">
    <div
      class="flex items-center justify-between px-sidebarX border-0 border-b border-solid border-slate-200 py-1"
    >
      <div class="w-max">
        <div class="typo-title2">
          {{ title }}
        </div>
        <div v-if="subtitle" class="typo-title5 mt-1">
          {{ subtitle }}
        </div>
      </div>
      <div class="flex items-center gap-4 justify-end py-2 w-fit">
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
          v-if="actions.length"
          :actions="actions"
          @action="($a) => emit('action', $a)"
          placement="bottom"
          :alignment="'end'"
          strategy="absolute"
        >
          <IconButton size="xl" name="more_horiz" default-colored />
        </ActionMenu>
        <IconButton
          class="-mx-iconButtonPadding"
          v-tooltip="{
            text: $t('core.close'),
            placement: 'top',
            alignment: 'end',
          }"
          name="close"
          size="xl"
          @click="handleClose"
        />
      </div>
    </div>
    <div
      class="px-sidebarX border-0 border-b border-solid border-slate-200"
      v-if="tabs?.length"
    >
      <PageTabs
        @update:currentTab="($e) => updateCurrentTab($e)"
        :tabs="tabs"
        class="mt-3"
      />
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
import PageTabs from "../PageTabs.vue";
import type { Tab } from "src/composables/tabs";

export type SidebarHeadAction = Action & { main?: boolean; color?: Color };

const emit = defineEmits(["action", "close", "update:currentTab"]);
defineProps<{
  title: string;
  subtitle?: string;
  actions: SidebarHeadAction[];
  tabs?: Tab[];
}>();

const sidebar = inject<SidebarInject>("sidebar");

function updateCurrentTab(currentTab: Tab["id"]) {
  emit("update:currentTab", currentTab);
  if (sidebar) {
    sidebar.setCurrentTab(currentTab);
  }
}

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
