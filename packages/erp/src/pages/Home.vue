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
x = 12
1 + 6.2
9 * 2
12 / 2
pow(4, 3)
2 pow 4
sqrt(4) pow 2
7€ to $
12.50$ to €
x pow 2 € to $
`.trim();
</script>
