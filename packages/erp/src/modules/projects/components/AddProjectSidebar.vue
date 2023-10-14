<template>
  <Sidebar :open="open" @update:open="emit('update:open', $event)">
    <SidebarHead
      :title="$t('pages.projects.new-projects')"
      :actions="[]"
    ></SidebarHead>
    <SidebarContent> BSGDS </SidebarContent>
  </Sidebar>
</template>

<script setup lang="ts">
import Sidebar from "core/src/components/sidebar/Sidebar.vue";
import SidebarContent from "core/src/components/sidebar/SidebarContent.vue";
import SidebarHead from "core/src/components/sidebar/SidebarHead.vue";

const props = defineProps<{
  open: boolean;
}>();

const emit = defineEmits(["update:open"]);
</script>
