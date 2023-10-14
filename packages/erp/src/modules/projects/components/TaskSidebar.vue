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
  <SidebarContent> </SidebarContent>
</template>

<script setup lang="ts">
import { computed } from "vue";

import SidebarHead from "core/src/components/sidebar/SidebarHead.vue";
import SidebarContent from "core/src/components/sidebar/SidebarContent.vue";
import Input from "core/src/components/form/Input.vue";

const props = defineProps<{
  selected?: any;
}>();

const emit = defineEmits(["update:selected"]);

const task = computed({
  get: () => props.selected,
  set: (val) => emit("update:selected", val),
});
</script>
