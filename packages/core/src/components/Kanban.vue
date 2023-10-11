<template>
  <div class="kanban">
    <draggable
      class="columns"
      v-model="columns"
      group="columns"
      @start="handleDragStart"
      @end="handleDragEnd"
      item-key="id"
      ghost-class="kanban-column-ghost"
      handle=".drag_handle"
      :forceFallback="true"
      dragClass="kanban-column-cloned-element"
    >
      <template #item="{ element }">
        <div class="column">
          <div
            class="flex items-center justify-between pl-4 pr-2 py-1 pb-4 typo-title4"
          >
            <div>
              {{ element?.title || "" }}
              <slot name="title" />
            </div>
            <Icon name="drag_indicator" class="drag_handle" />
          </div>
          <div class="px-2 grid gap-2">
            <slot
              v-for="card of element.elements"
              :key="card.id"
              name="element"
              :element="card"
            />
          </div>
        </div>
      </template>
    </draggable>
  </div>
</template>

<script setup lang="ts" generic="T">
import type { ID } from "../types";
import draggable from "vuedraggable";
import Icon from "./Icon.vue";
import { computed } from "vue";

export interface KanbanColumns<X> {
  id: ID;
  title?: string;
  elements: Array<X>;
}

export type kanbanProps<X> = {
  columns: KanbanColumns<X>[];
};

const props = defineProps<kanbanProps<T>>();

const emit = defineEmits(["update:columns"]);

function handleDragStart() {
  console.log("drag start");
}
function handleDragEnd() {
  console.error("DRAG START");
}
const columns = computed({
  get: () => props.columns,
  set: (val) => {
    emit("update:columns", val);
  },
});
</script>

<style>
.kanban {
  height: 100%;
  .columns {
    @apply h-full flex items-start gap-4;
    .column {
      @apply shadow-sm rounded min-w-[200px] h-full min-h-[200px] bg-white py-1;
      .drag_handle {
        cursor: grab;
      }
    }
  }
}
.kanban-column-cloned-element {
  opacity: 1 !important;
  max-height: 200px !important;
}
.kanban-column-ghost {
  opacity: 0.5 !important;
}
</style>
