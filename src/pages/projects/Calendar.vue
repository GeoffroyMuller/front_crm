<template>
  <Page :title="$t('calendar')">
    <CalendarVue is-card />
  </Page>
</template>

<script setup lang="ts">
import Page from "@/components/Page.vue";
import CalendarVue from "@/core/components/Calendar.vue";
</script>
