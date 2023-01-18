<template>
  <div></div>
</template>
<script setup lang="ts">
import useQuoteStore from "@/stores/quotes";
import type { Quote } from "@/types/quote";

export interface QuoteActionsProps {
  quote: Quote;
}
const props = withDefaults(defineProps<QuoteActionsProps>(), {});

const quotesStore = useQuoteStore();
</script>
