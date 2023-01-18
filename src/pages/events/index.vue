<template>
  <Page :title="$t('menu.events')">
    <Calendar is-card />
    <FloatingButton> <Icon name="add" /> </FloatingButton>
  </Page>
</template>

<script setup lang="ts">
import Page from "@/components/Page.vue";
import Calendar from "@/core/components/Calendar.vue";
import FloatingButton from "@/core/components/FloatingButton.vue";
import Icon from "@/core/components/Icon.vue";
</script>
