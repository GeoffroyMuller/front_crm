<template>
  <Page :title="$t('home')">
    <PdfViewer
      src="https://www.interieur.gouv.fr/content/download/32977/245942/file/cerfa_12669_01.pdf"
    />
  </Page>
</template>
<script setup lang="ts">
import Page from "@/components/Page.vue";
import PdfViewer from "core/src/components/PdfViewer.vue";
</script>
