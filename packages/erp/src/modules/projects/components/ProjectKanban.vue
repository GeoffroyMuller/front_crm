<template>
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
        @click.stop="handleClickCard(element, $event)"
        :class="{
          '!cursor-grab': drag,
        }"
      >
        <div>
          {{ element.name }}
        </div>
      </Card>
    </template>
    <template #column-footer="{ column }">
      <Button
        variant="text"
        class="m-auto mt-2"
        color="black"
        @click.stop="add(column)"
      >
        {{ $t("pages.projects.add-task") }}
      </Button>
    </template>
  </Kanban>
</template>

<script lang="ts" setup>
import type { Project, Task } from "@/types/project";
import Kanban, { type KanbanColumns } from "core/src/components/Kanban.vue";
import { SIDEBAR_ANIMATION_DURATION } from "core/src/components/sidebar/sidebar.types";
import { omitBy, uniqueId } from "lodash";
import { nextTick, computed, ref, watch } from "vue";
import Card from "core/src/components/card/Card.vue";
import Input from "core/src/components/form/Input.vue";
import Button from "core/src/components/Button.vue";
import IconButton from "core/src/components/IconButton.vue";

const props = defineProps<{
  id: Project["id"];
  selected?: Task;
  sidebarOpen: boolean;
  focusSidebarTitle: () => void;
}>();
const emit = defineEmits(["update:selected", "update:sidebarOpen"]);

const selected = computed({
  get: () => props.selected,
  set: (val) => emit("update:selected", val),
});

const sidebarOpen = computed({
  get: () => props.sidebarOpen,
  set: (val) => emit("update:sidebarOpen", val),
});

const drag = ref(false);

type DemoKanbanColmun = KanbanColumns<Partial<Task>>;

const COLUMNS_DEFAULTS: DemoKanbanColmun[] = [
  {
    id: 0,
    title: "A faire 📋",
    elements: [
      {
        id: 0,
        name: "Faire le kanban",
      },
      {
        id: 1,
        name: "Faire buttons",
      },
      { id: 5, name: "Faire des pates" },
      { id: 6, name: "Faire des chips" },
      { id: 7, name: "Preparer une apero" },
      { id: 8, name: "Preparer des crepes" },
      {
        id: 9,
        name: "Faire apparaitre la scrollbar avec plein de taches à la con",
      },
      {
        id: 10,
        name: "Faire apparaitre la scrollbar avec plein de taches à la con 2",
      },
      {
        id: 11,
        name: "Faire apparaitre la scrollbar avec plein de taches à la con 3",
      },
      { id: 12, name: "Preparer des gauffres" },
    ],
  },
  {
    id: 1,
    title: "En cours 💻👨‍💻",
    elements: [
      {
        id: 2,
        name: "Fix form",
      },
      {
        id: 3,
        name: "Fix carousel",
      },
    ],
  },
  { id: 2, title: "Terminé 👌", elements: [] },
  { id: 3, title: "A tester 🧪", elements: [] },
  { id: 4, title: "Reporté ✌", elements: [] },
  {
    id: 4,
    title: "Infos & Idées 💡",
    elements: [{ id: 4, name: "Ajouter un bouton pour ajouter une tâche" }],
  },
];

const columns = ref<DemoKanbanColmun[]>(COLUMNS_DEFAULTS);

function getIdColumInputTitle(idColumn: string | number) {
  return `kanban-project-${props.id}-column-${idColumn}-title-input`;
}

function isSelected(element: Task) {
  return selected.value?.id === element.id && sidebarOpen.value;
}

function add(column: DemoKanbanColmun) {
  const index = columns.value.findIndex((c) => c.id === column.id);

  if (index != -1) {
    columns.value[index].elements.push({
      id: Math.random(),
      name: "",
    });
    selected.value = columns.value[index].elements[
      columns.value[index].elements.length - 1
    ] as Task;
    sidebarOpen.value = true;
    props.focusSidebarTitle();
  }
}

function addColumn() {
  const idColumn = uniqueId("kanban_columns");
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
function handleClickCard(card: Task, event: Event) {
  sidebarOpen.value = true;
  selected.value = card;
  setTimeout(() => {
    const cardElement = event.target as HTMLElement;
    if (cardElement?.scrollIntoView) {
      cardElement.scrollIntoView({ behavior: "smooth" });
    }
  }, SIDEBAR_ANIMATION_DURATION);
}

function checkIfSelectedIsEmptyAndDelete(element?: Task) {
  const elem = element ?? selected.value;
  if (!elem) return;
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
