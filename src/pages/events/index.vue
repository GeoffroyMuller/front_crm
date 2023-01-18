<template>
  <Page :title="$t('menu.events')">
    <Calendar is-card />
    <FloatingButton @click.stop="editOpen = true">
      <Icon name="add" />
    </FloatingButton>

    <EditEventSidebar v-model:open="editOpen" />
  </Page>
</template>

<script setup lang="ts">
import EditEventSidebar from "@/components/events/EditEventSidebar.vue";
import Page from "@/components/Page.vue";
import Calendar from "@/core/components/Calendar.vue";
import FloatingButton from "@/core/components/FloatingButton.vue";
import Icon from "@/core/components/Icon.vue";
import type { Event } from "@/types/events";
import { ref } from "vue";

const editOpen = ref(false);
const eventEdited = ref<Event>();
</script>
