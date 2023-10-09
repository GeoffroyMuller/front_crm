<template>
  <Kanban :cards="cards" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import Kanban from "../Kanban.vue";

type DemoKanbanCard = { name: string; id: string; next: string };

const cards = ref<DemoKanbanCard[]>([]);
</script>
