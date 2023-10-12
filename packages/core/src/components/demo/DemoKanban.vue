<template>
  <Kanban
    v-model:columns="columns"
    @column-drag-start="drag = true"
    @element-drag-start="drag = true"
    @column-drag-end="drag = false"
    @element-drag-end="drag = false"
  >
    <template #title="{ column }">
      <Input v-model="column.title" variant="text" />
    </template>
    <template #element="{ element }">
      <Card
        padding
        :class="{
          'cursor-pointer': !drag,
          'cursor-grab': drag,
        }"
        @click.stop="handleClickCard(element)"
      >
        <div class="typo-title5">
          {{ element.title }}
        </div>
      </Card>
    </template>
    <template #column-footer="{ column }">
      <Button variant="text" class="m-auto mt-4" color="black">Ajouter</Button>
    </template>
  </Kanban>
  <Sidebar v-model:open="sidebarOpen">
    <SidebarHead :title="selected?.title || ''" :actions="[]"></SidebarHead>
    <SidebarContent> </SidebarContent>
  </Sidebar>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Kanban, { type KanbanColumns } from "../Kanban.vue";
import Card from "../card/Card.vue";
import Input from "../form/Input.vue";
import Button from "../Button.vue";
import Sidebar from "../sidebar/Sidebar.vue";
import SidebarHead from "../sidebar/SidebarHead.vue";
import SidebarContent from "../sidebar/SidebarContent.vue";
import Select from "../form/Select.vue";

type DemoKanbanColmun = {} & KanbanColumns<any>;

const selected = ref<DemoKanbanColmun["elements"][0]>();
const sidebarOpen = ref(false);
const drag = ref(false);

function handleClickCard(card: DemoKanbanColmun["elements"][0]) {
  sidebarOpen.value = true;
  selected.value = { ...card };
}

const columns = ref<DemoKanbanColmun[]>([
  {
    id: 0,
    title: "A faire 📋",
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
    title: "En cours 💻👨‍💻",
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
    title: "Terminé 👌",
    elements: [],
  },
]);

// @ts-ignore
window.columns = columns;
</script>
