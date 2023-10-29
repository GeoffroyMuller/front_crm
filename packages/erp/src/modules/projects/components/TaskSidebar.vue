<template>
  <SidebarHead
    :actions="[
      {
        action: () => handleRemoveTask(task),
        title: $t('delete'),
        icon: 'delete',
        color: 'danger',
      },
    ]"
  >
    <template #title>
      <div class="flex items-center">
        <CheckCircle
          :checked="task?.completed"
          @update:checked="handleToggleCompleted()"
          size="xl"
        />
        <Input
          variant="title"
          :model-value="task?.name"
          @update:model-value="(val) => (task.name = val)"
          @blur="updateName(task, task.name)"
          @keypress.enter="updateName(task, task.name)"
          ref="titleInputRef"
          class="mx-4"
        />
      </div>
    </template>
  </SidebarHead>
  <SidebarContent class="grid gap-6 max-w-[650px]">
    <div class="grid items-center grid-cols-[130px_1fr] gap-2">
      <Text typo="title7">{{ $t("pages.projects.task.responsible") }}</Text>
      <div class="w-fit -mx-selectActivatorPadding">
        <Select
          name="responsible"
          :options="[
            { label: 'Etienne', value: 0 },
            { label: 'Geoff', value: 1 },
          ]"
          :get-option-label="(opt) => opt.label"
          :get-option-value="(opt) => opt.value"
        >
          <template #activator>
            <div class="flex items-center gap-2">
              <Avatar custom-color="rgb(241, 120, 182)" color="primary">
                ER
              </Avatar>
              <Text>Etienne</Text>
            </div>
          </template>
        </Select>
      </div>
      <Text typo="title7">
        {{ $t("pages.projects.task.due_date") }}
      </Text>
      <div class="w-fit -mx-selectActivatorPadding">
        <DatePicker v-model="dueDate" name="due_date">
          <template #activator>
            <div class="flex items-center gap-2">
              <Avatar icon="date_range"> </Avatar>
              <Text v-if="dueDate">
                {{ $utils.formatDate(dueDate) }}
              </Text>
            </div>
          </template>
        </DatePicker>
      </div>
      <Text typo="title7">{{ $t("pages.projects.task.list") }}</Text>
      <div class="w-fit -mx-selectActivatorPadding">
        <Select
          :placeholder="$t('pages.projects.task.list-placeholder')"
          variant="text"
          name="list"
          :options="[
            { label: 'A faire', value: 0 },
            { label: 'En cours', value: 1 },
          ]"
          :get-option-label="(opt) => opt.label"
          :get-option-value="(opt) => opt.value"
        ></Select>
      </div>
    </div>
    <div class="grid gap-4 max-w-[650px]">
      <Text typo="title7">{{ $t("pages.projects.task.description") }}</Text>
      <Wysiwyg></Wysiwyg>
    </div>
  </SidebarContent>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";

import SidebarHead from "core/src/components/sidebar/SidebarHead.vue";
import SidebarContent from "core/src/components/sidebar/SidebarContent.vue";
import Input from "core/src/components/form/Input.vue";
import Select from "core/src/components/form/Select.vue";
import Text from "core/src/components/Text.vue";
import Avatar from "core/src/components/Avatar.vue";
import DatePicker from "core/src/components/form/datepicker/DatePicker.vue";
import Wysiwyg from "../../../../../core/src/components/form/Wysiwyg.vue";
import CheckCircle from "./CheckCircle.vue";
import useTask from "./tasks.composable";
import type { Task } from "@/types/project";

const props = defineProps<{
  selected?: any;
  sidebarOpen?: boolean;
}>();

const emit = defineEmits([]);

const task = ref<Task>(props.selected);

watch(
  () => props.selected,
  () => (task.value = { ...props.selected })
);

const { removeTask, toggleCompleted, updateName } = useTask();

async function handleToggleCompleted() {
  await toggleCompleted({ ...task.value });
  task.value.completed = !task.value.completed;
}

function handleRemoveTask(task: Task) {
  removeTask(task);
}

const dueDate = ref<string>(new Date().toISOString());
</script>
