<template>
  <Page :title="$t('home')">
    <Calculator :value="calculatorValue" />
    <WysiwygEditor label="Test" />
  </Page>
</template>
<script setup lang="ts">
import Page from "@/components/Page.vue";
import WysiwygEditor from "core/src/components/form/WysiwygEditor.vue";
import Calculator from "calculator";

const calculatorValue = `
1 + 6
9 * 2
12 / 2
pow(4, 3)
root(4)
`.trim();
</script>
