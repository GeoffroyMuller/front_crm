<template>
  <Page
    title="Monorepo"
    icon="check_circle"
    v-model:sidebarOpen="sidebarOpen"
    :tabs="[
      {
        id: 'overview',
        title: $t('pages.projects.overview'),
      },
      {
        id: 'list',
        title: $t('pages.projects.list'),
      },
      {
        id: 'kanban',
        title: $t('pages.projects.kanban'),
      },
      /* {
        id: 'calendar',
        title: 'Calendrier',
      },
      {
        id: 'gantt',
        title: 'Gantt',
      },
      {
        id: 'timeline',
        title: 'Timeline',
      },
      {
        id: 'timeqsdline',
        title: 'Timeline',
      },
      {
        id: 'timeline',
        title: 'Timeline',
      },*/
    ]"
  >
    <template #head-end>
      <div class="flex flex-col items-end justify-end gap-2">
        <div class="flex justify-end">
          <Avatar
            selectable
            size="sm"
            class="-mr-4"
            color="primary"
            custom-color="rgb(241, 120, 182)"
          >
            ER
          </Avatar>
          <Avatar selectable size="sm" class="-mr-4" color="success">
            GM
          </Avatar>
          <Avatar selectable size="sm" class="" color="warning"> CR </Avatar>

          <Button class="ml-4" variant="outlined" color="primary">
            {{ $t("pages.projects.share") }}
          </Button>
        </div>
        <Menu placement="bottom" alignment="end">
          <template #activator>
            <Button icon="filter_alt" variant="text">
              {{ $t("core.to_filter") }}
            </Button>
          </template>
          <template #content>
            <div class="p-4">ICI CE TROUVERONS LES FILTRES</div>
          </template>
        </Menu>
      </div>
    </template>
    <Kanban
      v-model:columns="columns"
      @column-drag-start="drag = true"
      @element-drag-start="drag = true"
      @column-drag-end="drag = false"
      @element-drag-end="drag = false"
    >
      <template #section-end>
        <div class="h-input grid items-center">
          <Button variant="text" color="black" @click.stop="addColumn()">
            {{ $t("pages.projects.add-section") }}
          </Button>
        </div>
      </template>
      <template #title="{ column }">
        <div class="flex items-center">
          <Input
            v-model="column.title"
            variant="text"
            class="!pl-0 hover:!pl-inputXPadding focus-within:!pl-inputXPadding transition-all flex-1"
            :id="getIdColumInputTitle(column.id)"
          />
          <IconButton name="more_horiz" class="mx-1" color="primary" />
        </div>
      </template>
      <template #element="{ element }">
        <Card
          selectable
          :selected="isSelected(element)"
          class="p-4 min-h-[70px]"
          :class="{
            '!cursor-grab': drag,
          }"
          @click.stop="handleClickCard(element, $event)"
        >
          <div>
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
        >
          {{ $t("pages.projects.add-task") }}
        </Button>
      </template>
    </Kanban>
    <template #sidebar>
      <TaskSidebar :selected="selected" />
    </template>
  </Page>
</template>
<script lang="ts" setup>
import Page from "core/src/components/Page.vue";
import Kanban, { type KanbanColumns } from "core/src/components/Kanban.vue";
import Card from "core/src/components/card/Card.vue";
import Input from "core/src/components/form/Input.vue";
import Button from "core/src/components/Button.vue";
import { watch, ref, nextTick, inject } from "vue";
import { omitBy } from "lodash";
import { useRouter, useRoute } from "vue-router";
import { SIDEBAR_ANIMATION_DURATION } from "core/src/components/sidebar/sidebar.types";
import Menu from "core/src/components/Menu.vue";
import Avatar from "core/src/components/Avatar.vue";
import TaskSidebar from "../components/TaskSidebar.vue";
import IconButton from "core/src/components/IconButton.vue";

type DemoKanbanColmun = KanbanColumns<any>;

const { id } = useRoute().params;

function getIdColumInputTitle(idColumn: string | number) {
  return `kanban-project-${id}-column-${idColumn}-title-input`;
}

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
      { id: 5, title: "Faire des pates" },
      { id: 6, title: "Faire des chips" },
      { id: 7, title: "Preparer une apero" },
      { id: 8, title: "Preparer des crepes" },
      {
        id: 9,
        title: "Faire apparaitre la scrollbar avec plein de taches à la con",
      },
      {
        id: 10,
        title: "Faire apparaitre la scrollbar avec plein de taches à la con 2",
      },
      {
        id: 11,
        title: "Faire apparaitre la scrollbar avec plein de taches à la con 3",
      },
      { id: 12, title: "Preparer des gauffres" },
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
  { id: 2, title: "Terminé 👌", elements: [] },
  { id: 3, title: "A tester 🧪", elements: [] },
  { id: 4, title: "Reporté ✌", elements: [] },
  {
    id: 4,
    title: "Infos & Idées 💡",
    elements: [{ id: 4, title: "Ajouter un bouton pour ajouter une tâche" }],
  },
];

const selected = ref<DemoKanbanColmun["elements"][0]>();
const sidebarOpen = ref(false);
const drag = ref(false);
const titleInputRef = ref();

function handleClickCard(card: DemoKanbanColmun["elements"][0], event: Event) {
  sidebarOpen.value = true;
  selected.value = card;
  setTimeout(() => {
    const cardElement = event.target as HTMLElement;
    if (cardElement?.scrollIntoView) {
      cardElement.scrollIntoView({ behavior: "smooth" });
    }
  }, SIDEBAR_ANIMATION_DURATION);
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

function addColumn() {
  const idColumn = Math.random();
  columns.value.push({
    id: idColumn,
    title: "",
    elements: [],
  });
  nextTick(() => {
    const inputTitle = document.getElementById(getIdColumInputTitle(idColumn));
    if (inputTitle != null) {
      inputTitle.focus();
    }
  });
}

function checkIfSelectedIsEmptyAndDelete(
  element?: DemoKanbanColmun["elements"][0]
) {
  const elem = element ?? selected.value;
  const selectedPurged = omitBy(
    elem,
    (k) => k == null || (typeof k === "string" && k.trim() === "")
  );
  if (Object.keys(selectedPurged).length === 1) {
    columns.value.forEach((c, i) => {
      const index = c.elements.findIndex((e) => e.id === elem.id);
      if (index != -1) {
        columns.value[i].elements = columns.value[i].elements.filter(
          (e, i) => i !== index
        );
      }
    });
  }
}

function isSelected(element: DemoKanbanColmun["elements"][0]) {
  return selected.value?.id === element.id && sidebarOpen.value;
}

watch(
  () => sidebarOpen.value,
  () => {
    if (!sidebarOpen.value) {
      checkIfSelectedIsEmptyAndDelete();
    }
  }
);
watch(
  () => selected.value,
  (val, old) => {
    checkIfSelectedIsEmptyAndDelete(old);
  }
);
</script>
