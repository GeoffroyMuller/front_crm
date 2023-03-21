<template>
  <Page :title="$t('home')">
    <WysiwygEditor label="Test" />
  </Page>
</template>
<script setup lang="ts">
import Page from "@/components/Page.vue";
import WysiwygEditor from "core/src/components/form/WysiwygEditor.vue";
</script>
