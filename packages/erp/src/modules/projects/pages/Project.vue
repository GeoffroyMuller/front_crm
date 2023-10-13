<template>
  <Page title="Monorepo" icon="check_circle">
    <Kanban
      v-model:columns="columns"
      @column-drag-start="drag = true"
      @element-drag-start="drag = true"
      @column-drag-end="drag = false"
      @element-drag-end="drag = false"
    >
      <template #title="{ column }">
        <Input v-model="column.title" variant="text" typo="title4" />
      </template>
      <template #element="{ element }">
        <Card
          selectable
          class="p-4 min-h-[70px]"
          :class="{
            '!cursor-grab': drag,
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
    <Sidebar disable-teleport v-model:open="sidebarOpen">
      <SidebarHead :actions="[]">
        <template #title>
          <Input
            variant="text"
            :model-value="selected?.title"
            @update:model-value="selected.title = $event"
            ref="titleInputRef"
            class="-ml-inputXPadding !h-12"
            typo="title2"
          />
        </template>
      </SidebarHead>
      <SidebarContent> </SidebarContent>
    </Sidebar>
  </Page>
</template>
<script lang="ts" setup>
import Page from "core/src/components/Page.vue";
import Kanban, { type KanbanColumns } from "core/src/components/Kanban.vue";
import Card from "core/src/components/card/Card.vue";
import Input from "core/src/components/form/Input.vue";
import Button from "core/src/components/Button.vue";
import Sidebar from "core/src/components/sidebar/Sidebar.vue";
import SidebarHead from "core/src/components/sidebar/SidebarHead.vue";
import SidebarContent from "core/src/components/sidebar/SidebarContent.vue";
import { watch, ref } from "vue";
import { omitBy } from "lodash";

type DemoKanbanColmun = {} & KanbanColumns<any>;

const COLUMNS_DEFAULTS = [
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
];

const selected = ref<DemoKanbanColmun["elements"][0]>();
const sidebarOpen = ref(false);
const drag = ref(false);
const titleInputRef = ref();

function handleClickCard(card: DemoKanbanColmun["elements"][0]) {
  sidebarOpen.value = true;
  selected.value = card;
}

const columns = ref<DemoKanbanColmun[]>(COLUMNS_DEFAULTS);

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
</script>
