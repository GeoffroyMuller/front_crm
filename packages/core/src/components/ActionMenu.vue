<template>
  <Menu
    :placement="placement"
    :alignment="alignment"
    :gap="0.5"
    :strategy="strategy || 'root'"
    :card-props="{ rounded: 'sm' }"
  >
    <template #activator>
      <slot />
    </template>
    <template #content>
      <div class="grid gap-1 py-1 w-max overflow-hidden">
        <div
          class="flex gap-2 items-center cursor-pointer px-2 py-1.5 hover:bg-slate-100 typo-title6 font-normal"
          :class="{
            [`text-${action.color}-500 hover:text-${action.color}-600`]:
              action.color,
          }"
          v-for="action in actions"
          :key="action.title"
          @click="handleAction(action)"
          tabindex="0"
          @keyup.enter="handleAction(action)"
        >
          <Icon
            size="sm"
            v-if="action.icon"
            :name="(action.icon as IconName)"
          ></Icon>
          {{ action.title }}
        </div>
      </div>
    </template>
  </Menu>
</template>
<script setup lang="ts">
import Menu from "./Menu.vue";
import Icon from "./Icon.vue";
import type { Color, IconName } from "./types";
import type { MenuProps } from "../composables/menu";

export interface Action {
  icon?: IconName;
  action: string | (() => void);
  title: string;
  color?: Color;
}
interface ActionMenuProps {
  actions: Action[];
  placement?: MenuProps["placement"];
  alignment?: MenuProps["alignment"];
  strategy?: MenuProps["strategy"];
}
const props = withDefaults(defineProps<ActionMenuProps>(), {});
const emit = defineEmits(["action"]);

function handleAction(a: Action) {
  if (typeof a.action === "string") {
    emit("action", a.action);
  } else {
    a.action();
  }
}
</script>
