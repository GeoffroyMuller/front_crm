<template>
  <Kanban v-model:columns="columns">
    <template #element="{ element }">
      <Card padding>
        <div class="typo-title5">
          {{ element.title }}
        </div>
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
        title: "Faire le kanban",
      },
      {
        id: 1,
        title: "Faire buttons",
      },
    ],
  },
  {
    id: 1,
    title: "En cours",
    elements: [
      {
        id: 2,
        title: "Fix form",
      },
      {
        id: 3,
        title: "Fix carousel",
      },
    ],
  },
  {
    id: 2,
    title: "Terminé",
    elements: [],
  },
]);
</script>
