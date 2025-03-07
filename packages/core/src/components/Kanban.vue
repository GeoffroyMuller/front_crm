<template>
  <div class="kanban">
    <div class="columns-wrapper">
      <draggable
        v-if="columns?.length"
        class="columns"
        v-model="columns"
        group="columns"
        @start="emit('column-drag-start')"
        @end="emit('column-drag-end')"
        item-key="id"
        ghost-class="kanban-column-ghost"
        handle=".drag_handle"
        :forceFallback="true"
        dragClass="kanban-column-cloned-element"
      >
        <template #item="{ element: column }">
          <div class="column">
            <div class="flex items-center justify-between typo-title4">
              <Icon name="drag_indicator" class="drag_handle" />
              <div v-if="!$slots.title">
                {{ column?.title || "" }}
              </div>
              <div v-else class="flex-1">
                <slot name="title" :column="column" />
              </div>
            </div>

            <draggable
              item-key="id"
              class="flex-1 overflow-auto"
              group="elements"
              :list="column.elements"
              @start="emit('element-drag-start')"
              @end="emit('element-drag-end')"
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
              <template #footer>
                <div>
                  <slot name="column-footer" :column="column" />
                </div>
              </template>
            </draggable>
          </div>
        </template>
      </draggable>
      <div class="column !px-0 !bg-transparent" v-if="$slots['section-end']">
        <slot name="section-end" />
      </div>
    </div>
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

const emit = defineEmits([
  "update:columns",
  "column-drag-start",
  "column-drag-end",
  "element-drag-start",
  "element-drag-end",
]);

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
  .columns,
  .columns-wrapper {
    @apply h-full flex items-start gap-4;
    .column {
      @apply h-full min-h-[200px] flex flex-col p-4 rounded min-w-[300px] max-w-[300px] bg-gray-100;
      .drag_handle {
        cursor: grab;
      }
    }
  }
}
.kanban-column-cloned-element {
  opacity: 1 !important;
  max-height: 600px !important;
  @apply bg-slate-100 shadow-sm rounded;
}
.kanban-column-ghost {
  position: relative;
  &::before {
    content: " ";
    @apply bg-slate-300 absolute top-0 left-0 w-full h-full z-20 rounded;
  }
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
