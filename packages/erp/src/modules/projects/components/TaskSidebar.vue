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
  <SidebarContent>
    <div class="grid items-center grid-cols-[130px_1fr]">
      <Text typo="title7">{{ $t("pages.projects.task.responsible") }}</Text>
      <Select variant="text" :options="[]" />
    </div>
  </SidebarContent>
</template>

<script setup lang="ts">
import { computed } from "vue";

import SidebarHead from "core/src/components/sidebar/SidebarHead.vue";
import SidebarContent from "core/src/components/sidebar/SidebarContent.vue";
import Input from "core/src/components/form/Input.vue";
import Select from "core/src/components/form/Select.vue";
import Text from "core/src/components/Text.vue";

const props = defineProps<{
  selected?: any;
}>();

const emit = defineEmits(["update:selected"]);

const task = computed({
  get: () => props.selected,
  set: (val) => emit("update:selected", val),
});
</script>
