<template>
  <Menu placement="left">
    <template #activator>
      <slot />
    </template>
    <template #content>
      <div class="actions-menu">
        <div
          class="action"
          v-for="action in props.actions"
          :key="action.action"
          @click.stop="$emit('action', action.action)"
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

interface Action {
  icon: IconName;
  action: string;
  title: string;
  condition?: (data: any) => boolean;
}
interface ActionMenuProps {
  actions: Action[];
}
const props = withDefaults(defineProps<ActionMenuProps>(), {});
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
