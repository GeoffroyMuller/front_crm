<template>
  <div></div>
</template>

<script setup lang="ts" generic="T extends KanbanCard">
import type { ID } from "../types";

export interface KanbanCard {
  id: ID;
  next: KanbanCard["id"];
}

export type kanbanProps<X extends KanbanCard> = {
  cards: X[];
};

const props = defineProps<kanbanProps<T>>();



</script>
