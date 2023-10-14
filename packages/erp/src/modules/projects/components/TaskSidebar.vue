<template>
  <SidebarHead :actions="[]">
    <template #title>
      <Input
        variant="title"
        :model-value="task?.title"
        @update:model-value="task.title = $event"
        ref="titleInputRef"
        class="-ml-inputXPadding"
      />
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
              <Avatar custom-color="rgb(241, 120, 182)" color="primary"> ER </Avatar>
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
    </div>
    <div class="grid gap-2 max-w-[650px]">
      <Text typo="title7">{{ $t("pages.projects.task.description") }}</Text>
      <Wysiwyg2 variant="text"></Wysiwyg2>
    </div>
  </SidebarContent>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

import SidebarHead from "core/src/components/sidebar/SidebarHead.vue";
import SidebarContent from "core/src/components/sidebar/SidebarContent.vue";
import Input from "core/src/components/form/Input.vue";
import Select from "core/src/components/form/Select.vue";
import Text from "core/src/components/Text.vue";
import Avatar from "core/src/components/Avatar.vue";
import DatePicker from "core/src/components/form/datepicker/DatePicker.vue";
import Wysiwyg2 from "../../../../../core/src/components/form/Wysiwyg2.vue";

const props = defineProps<{
  selected?: any;
}>();

const emit = defineEmits(["update:selected"]);

const task = computed({
  get: () => props.selected,
  set: (val) => emit("update:selected", val),
});

const dueDate = ref<string>();
</script>
