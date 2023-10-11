<template>
  <Kanban v-model:columns="columns">
    <template #element="{ element }">
      <Card>
        {{ element }}
      </Card>
    </template>
  </Kanban>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Kanban, { type KanbanColumns } from "../Kanban.vue";
import Card from "../card/Card.vue";

type DemoKanbanColmun = {} & KanbanColumns<any>;

const columns = ref<DemoKanbanColmun[]>([
  {
    id: 0,
    title: "A faire",
    elements: [
      {
        id: 0,
      },
      {
        id: 1,
      },
    ],
  },
  {
    id: 1,
    title: "En cours",
    elements: [
      {
        id: 2,
      },
      {
        id: 3,
      },
    ],
  },
]);
</script>
