<template>
  <Page :title="$t('home')" icon="home">
    <Demo />
  </Page>
</template>
<script setup lang="ts">
import Page from "@/components/Page.vue";
import Demo from "core/src/components/demo/Demo.vue";
</script>
