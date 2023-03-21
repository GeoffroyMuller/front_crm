<template>
  <div class="quote-invoice-modele-editor">
    <Card class="content">THEME</Card>
  </div>
</template>

<script setup lang="ts">
import type { QuoteInvoiceTheme } from "@/types/quotetheme";
import Card from "core/src/components/Card.vue";
import { ref } from "vue";

const theme = ref<QuoteInvoiceTheme>();
</script>

<style lang="scss">
.quote-invoice-modele-editor {
  background: color("zinc", 200);
  padding: spacing(2);
  .content {
    max-width: 1200px;
    margin: auto;
    border: color("zinc", 300) 1px solid;
  }
}
</style>
