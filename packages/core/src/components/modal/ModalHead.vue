<template>
  <CardHead :title="title" :subtitle="subtitle">
    <template #end>
      <IconButton @click.stop="modal?.close?.()" name="close" size="xl" />
    </template>
  </CardHead>
</template>

<script setup lang="ts">
import CardHead from "../card/CardHead.vue";
import IconButton from "../IconButton.vue";
import { inject } from "vue";
import type { ModalInject } from "./Modal.vue";

defineProps<{
  title?: string;
  subtitle?: string;
}>();

const modal = inject<ModalInject>("modal");
</script>
