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
        <Button
          icon="add"
          variant="text"
          color="black"
          @click.stop="addColumn()"
        >
          {{ $t("pages.projects.add-section") }}
        </Button>
      </div>
    </template>
    <template #title="{ column }">
      <div class="flex items-center">
        <Input
          :model-value="column.title"
          :key="column.id"
          @keypress.enter="
            ($event) => {
              $event.target.blur();
              addColumn();
            }
          "
          @blur="
            ($event) => {
              column.title = $event.target.value;
              handleUpdateSectionTitle(column, $event.target.value);
            }
          "
          variant="text"
          class="flex-1"
          input-class="!font-semibold"
          :id="getIdColumInputTitle(column.id)"
        />
        <ActionMenu
          placement="bottom"
          alignment="end"
          :actions="[
            {
              title: $t('pages.projects.delete-section'),
              action: () => removeColumn(column),
              color: 'warning',
              icon: 'delete',
            },
          ]"
        >
          <IconButton name="more_horiz" class="mx-1" color="black" />
        </ActionMenu>
      </div>
    </template>
    <template #element="{ element }">
      <TaskCard
        :isSelected="isSelected"
        :element="element"
        @click.stop="handleClickCard(element, $event)"
      />
    </template>
    <template #column-footer="{ column }">
      <Card
        :class="{
          'invisible select-none pointer-events-none opacity-0 max-h-0':
            addTaskOpen?.id != column.id,
          'opacity-100 mt-2 min-h-[70px] p-4 transition-all':
            addTaskOpen?.id == column.id,
        }"
      >
        <div class="flex gap-2 items-center">
          <Input
            :id="getAddTaskInputID(column.id)"
            v-model="addTaskTitle"
            @blur="add()"
            @keypress.enter="add(true)"
          />
        </div>
      </Card>
      <Button
        variant="text"
        class="m-auto mt-2"
        color="black"
        @click.stop="prepareAdd(column)"
        icon="add"
      >
        {{ $t("pages.projects.add-task") }}
      </Button>
    </template>
  </Kanban>
</template>

<script lang="ts" setup>
import type { Section, Project, Task } from "@/types/project";
import Kanban, { type KanbanColumns } from "core/src/components/Kanban.vue";
import { SIDEBAR_ANIMATION_DURATION } from "core/src/components/sidebar/sidebar.types";
import { omitBy, uniqueId } from "lodash";
import { nextTick, computed, ref, watch } from "vue";
import Card from "core/src/components/card/Card.vue";
import Input from "core/src/components/form/Input.vue";
import Button from "core/src/components/Button.vue";
import IconButton from "core/src/components/IconButton.vue";
import useProjectsStore from "../stores/projects.store";
import { onMounted } from "vue";
import useUI from "core/src/composables/ui";
import { useI18n } from "vue-i18n";
import useSectionsStore from "../stores/sections.store";
import useTasksStore from "../stores/tasks.store";
import ActionMenu from "core/src/components/ActionMenu.vue";
import TaskCard from "./TaskCard.vue";

const props = defineProps<{
  id: Project["id"];
  selected?: Task;
  sidebarOpen: boolean;
}>();
const emit = defineEmits(["update:selected", "update:sidebarOpen"]);

const projectStore = useProjectsStore();
const projectSectionStore = projectStore.getDerivedStore<Section>(
  props.id,
  "sections",
  {}
);
const sectionStore = useSectionsStore();
const tasksStore = useTasksStore();

const { toast } = useUI();
const { t } = useI18n();

const _mapSectionToColumn = (s: Section) => {
  const column = {
    id: s.id,
    title: s.name,
    elements: [],
  };
  tasksStore.fetchList({ idSection: s.id }, false).then((tasksRes) => {
    columns.value[columns.value.findIndex((c) => c.id == s.id)].elements =
      tasksRes.results;
  });
  return column;
};

async function initialFetch() {
  try {
    await projectSectionStore.fetchList();
    columns.value = sections.value.map(_mapSectionToColumn);
  } catch (err) {
    console.error(err);
  }
}

onMounted(initialFetch);

const sections = computed(() => {
  return projectSectionStore.getList;
});

const selected = computed({
  get: () => props.selected,
  set: (val) => emit("update:selected", val),
});

watch(
  () => selected.value,
  (val, old) => {
    if (old != null && val != null) {
      let columnIndex, taskIndex;
      columns.value.find((c, i) => {
        const index = c.elements.findIndex((t) => t.id == val.id);
        if (index == -1) return false;
        columnIndex = i;
        taskIndex = index;
        return true;
      });
      if (columnIndex && taskIndex) {
        columns.value[columnIndex].elements[taskIndex] = val;
      }
    }
  },
  {
    deep: true,
  }
);

const sidebarOpen = computed({
  get: () => props.sidebarOpen,
  set: (val) => emit("update:sidebarOpen", val),
});

const drag = ref(false);

type TaskKanbanColumn = KanbanColumns<Partial<Task>>;

const columns = ref<TaskKanbanColumn[]>([]);

function getIdColumInputTitle(idColumn: string | number) {
  return `kanban-project-${props.id}-column-${idColumn}-title-input`;
}

function isSelected(element: Task) {
  return selected.value?.id === element.id && sidebarOpen.value;
}

const addTaskOpen = ref<TaskKanbanColumn>();
const addTaskTitle = ref("");
function getAddTaskInputID(columnID: TaskKanbanColumn["id"]) {
  return `kanban-column-${columnID}-new-task`;
}

function prepareAdd(column: TaskKanbanColumn) {
  addTaskOpen.value = column;
  setTimeout(() => {
    const inputNewTaskTitle = document.getElementById(
      getAddTaskInputID(column.id)
    );
    inputNewTaskTitle?.focus();
  }, 100);
}

async function add(prepareNew = false) {
  if (addTaskOpen.value == null) return;
  const column = addTaskOpen.value;
  addTaskOpen.value = prepareNew ? addTaskOpen.value : undefined;
  if (addTaskTitle.value.length == 0) return;
  const title = addTaskTitle.value;
  addTaskTitle.value = "";
  const index = columns.value.findIndex((c) => c.id === column.id);
  if (index != -1) {
    try {
      const task = await tasksStore.create({
        idSection: column.id as number,
        name: title,
      });
      columns.value[index].elements.push(task);
    } catch (err) {
      toast({
        type: "danger",
        message: t("error_occured"),
      });
    }
  }
}

async function addColumn() {
  const idColumn = uniqueId("kanban_columns");
  const column = {
    id: idColumn,
    title: "",
    elements: [],
  };
  columns.value.push(column);
  nextTick(async () => {
    const inputTitle = document.getElementById(getIdColumInputTitle(idColumn));
    if (inputTitle != null) {
      try {
        const s = await projectSectionStore.create({ idProject: props.id });
        column.id = s.id as unknown as string;
        inputTitle.focus();
      } catch (err) {
        toast({
          type: "danger",
          message: t("error_occured"),
        });
      }
    }
  });
}

async function handleUpdateSectionTitle(column: TaskKanbanColumn, val: string) {
  try {
    await sectionStore.update(column.id, {
      name: val,
    });
  } catch (err) {
    toast({
      type: "danger",
      message: t("error_occured"),
    });
  }
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

async function removeColumn(column: TaskKanbanColumn) {
  try {
    columns.value = columns.value.filter((c) => c.id !== column.id);
    await sectionStore.delete(column.id);
  } catch (err) {
    toast({
      type: "danger",
      message: t("error_occured"),
    });
  }
}
</script>
