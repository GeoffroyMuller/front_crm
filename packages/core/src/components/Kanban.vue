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
      <template #item="{ element: column }">
        <div class="column">
          <div
            class="flex items-center justify-between pl-4 pr-2 py-1 pb-4 typo-title4"
          >
            <div>
              {{ column?.title || "" }}
              <slot name="title" />
            </div>
            <Icon name="drag_indicator" class="drag_handle" />
          </div>
          <div class="px-2">
            <draggable
              item-key="id"
              group="elements"
              :list="column.elements"
              @start="handleDragStart"
              @end="handleDragEnd"
              handle=".drag_handle_element"
              ghost-class="kanban-elem-ghost"
              :forceFallback="true"
              dragClass="kanban-elem-cloned-element"
            >
              <template #item="{ element }">
                <div class="drag_handle_element cursor-grab mt-2">
                  <slot :key="element.id" name="element" :element="element" />
                </div>
              </template>
            </draggable>
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
  console.log("drag end");
}
const columns = computed({
  get: () => props.columns,
  set: (val) => {
    emit("update:columns", val);
  },
});

// @ts-ignore
window.columns = columns;
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
  max-height: 600px !important;
}
.kanban-column-ghost {
  opacity: 0.5 !important;
}
.kanban-elem-cloned-element {
  opacity: 1 !important;
  max-height: 600px !important;
}
.kanban-elem-ghost {
  > * {
    position: relative;
    &::before {
      content: " ";
      border-radius: inherit;
      @apply bg-slate-300 absolute top-0 left-0 w-full h-full;
    }
  }
}
</style>
