<template>
  <TextField
    v-bind="{ ...$props, ...$attrs }"
    class="QuoteInvoiceThemeEditorInputWrapper"
    inputClass="QuoteInvoiceThemeEditorInput"
  />
</template>
<script setup lang="ts">
import TextField from "core/src/components/form/TextField.vue";

interface QuoteInvoiceThemeEditorInputProps {
  label?: string;
  modelValue?: string;
  name?: string;
  icon?: string;
}

defineProps<QuoteInvoiceThemeEditorInputProps>();
</script>

<style lang="scss">
.QuoteInvoiceThemeEditorInputWrapper {
  width: fit-content;
  .QuoteInvoiceThemeEditorInput {
    min-height: 0 !important;
    height: auto !important;
    max-width: 220px;
  }
}
</style>
