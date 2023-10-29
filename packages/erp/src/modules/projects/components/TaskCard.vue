<template>
  <Card selectable :selected="isSelected(element)" class="p-4 min-h-[70px]">
    <div class="flex gap-2 items-center">
      <CheckCircle :checked="task.completed" size="sm" />
      <span>{{ task.name }}</span>
    </div>
  </Card>
</template>

<script setup lang="ts">
import type { Task } from "@/types/project";
import Card from "core/src/components/card/Card.vue";
import CheckCircle from "./CheckCircle.vue";
import { computed } from "vue";
import useTasksStore from "../stores/tasks.store";

const props = defineProps<{
  element: Task;
  isSelected: (task: Task) => boolean;
}>();

const tasksStore = useTasksStore();

const task = computed<Task>(() => {
  return tasksStore.getById(props.element.id) || props.element;
});
</script>
