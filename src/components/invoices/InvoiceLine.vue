<template>
  <QuoteLine :line="line"></QuoteLine>
</template>

<script setup lang="ts">
import type { InvoiceLine } from "@/types/invoice";
import QuoteLine from "../quotes/QuoteLine.vue";

interface InvoiceLineProps {
  line: InvoiceLine;
}

const props = withDefaults(defineProps<InvoiceLineProps>(), {});
</script>
