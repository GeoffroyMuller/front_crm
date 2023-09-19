<template>
  <TreeItem
    v-bind="props"
    v-if="displayTooltip()"
    v-tooltip="{
      text: tooltip,
      placement: 'right',
    }"
    @click="$emit('click')"
  />
  <TreeItem v-bind="props" v-if="!displayTooltip()" @click="$emit('click')" />
</template>
<script setup lang="ts">
import type { IconName } from "../../components/types";
import TreeItem from "./TreeItem.vue";

interface TreeItemTooltipProps {
  tooltip?: string;
  selected: boolean;
  displayLabel?: boolean;
  label?: string;
  icon: IconName;
  fullWidth?: boolean;
}

const props = defineProps<TreeItemTooltipProps>();

function displayTooltip(): boolean {
  return Boolean(props.label?.length && !props.displayLabel);
}
</script>
