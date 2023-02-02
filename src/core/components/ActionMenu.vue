<template>
  <Menu :placement="placement">
    <template #activator>
      <slot />
    </template>
    <template #content>
      <div class="actions-menu">
        <div
          class="action"
          v-for="action in actions"
          :key="action.title"
          @click="handleAction(action)"
        >
          <Icon :name="(action.icon as IconName)"></Icon>
          {{ $t(action.title) }}
        </div>
      </div>
    </template>
  </Menu>
</template>
<script setup lang="ts">
import Menu from "@/core/components/Menu.vue";
import Icon from "@/core/components/Icon.vue";
import type { IconName } from "@/core/components/types";
import type { MenuProps } from "../helpers/vue/composables/menu";

interface Action {
  icon: IconName;
  action: string | (() => void);
  title: string;
  condition?: (data: any) => boolean;
}
interface ActionMenuProps {
  actions: Action[];
  placement?: MenuProps["placement"];
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

<style lang="scss">
.actions-menu {
  display: grid;
  gap: spacing(0.5);
  padding: spacing(1) 0;
  .action {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: spacing(1);
    width: 100%;
    padding: spacing(0.25) spacing(1);
    min-width: max-content;
    cursor: pointer;
    &:hover {
      background-color: color("primary", 50);
    }
  }
}
</style>
