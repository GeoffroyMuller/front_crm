<template>
  <QuoteLine :line="line"></QuoteLine>
</template>

<script setup lang="ts">
import type { SaleLine } from "@/types/sale";
import QuoteLine from "../quotes/QuoteLine.vue";

interface InvoiceLineProps {
  line: SaleLine;
}

const props = withDefaults(defineProps<InvoiceLineProps>(), {});
</script>
