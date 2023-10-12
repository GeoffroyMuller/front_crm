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
        selectable
        class="p-4 min-h-[70px]"
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
      <Button
        variant="text"
        class="m-auto mt-4"
        color="black"
        @click.stop="add(column)"
        >Ajouter</Button
      >
    </template>
  </Kanban>
  <Sidebar v-model:open="sidebarOpen">
    <SidebarHead :actions="[]">
      <template #title>
        <Input
          variant="text"
          :model-value="selected?.title"
          @update:model-value="selected.title = $event"
          ref="titleInputRef"
        />
      </template>
    </SidebarHead>
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
import { watch } from "vue";
import { omitBy } from "lodash";

type DemoKanbanColmun = {} & KanbanColumns<any>;

const selected = ref<DemoKanbanColmun["elements"][0]>();
const sidebarOpen = ref(false);
const drag = ref(false);
const titleInputRef = ref();

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

function add(column: DemoKanbanColmun) {
  const index = columns.value.findIndex((c) => c.id === column.id);

  if (index != -1) {
    columns.value[index].elements.push({
      id: Math.random(),
      title: "",
    });
    selected.value =
      columns.value[index].elements[columns.value[index].elements.length - 1];
    sidebarOpen.value = true;
    titleInputRef?.value?.$refs?.internalRef?.focus();
  }
}

watch(
  () => sidebarOpen.value,
  () => {
    if (!sidebarOpen.value) {
      const selectedPurged = omitBy(
        selected.value,
        (k) => k == null || (typeof k === "string" && k.trim() === "")
      );
      console.error({ selectedPurged });
      if (Object.keys(selectedPurged).length === 1) {
        columns.value.forEach((c, i) => {
          const index = c.elements.findIndex((e) => e.id === selected.value.id);
          if (index != -1) {
            columns.value[i].elements = columns.value[i].elements.filter(
              (e, i) => i !== index
            );
          }
        });
      }
    }
  }
);

// @ts-ignore
window.columns = columns;
</script>
