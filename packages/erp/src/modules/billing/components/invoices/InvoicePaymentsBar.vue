<template>
  <div class="typo-label text-primary-500">
    <div class="mb-1">
      {{ $utils.formatPrice(totalPayments) }}
    </div>
    <ProgressBar :progress="progress" />
  </div>
</template>

<script setup lang="ts">
import ProgressBar from "core/src/components/ProgressBar.vue";
import type Invoice from "../../types";
import { computed } from "vue";

interface InvoicePaymentsBarProps {
  invoice: Invoice;
}

const total = computed(
  () => (props.invoice?.price || 0) + (props.invoice?.taxes || 0)
);

const totalPayments = computed(() =>
  (props.invoice?.payments || []).reduce(
    (prev, current) => prev + current.amount,
    0
  )
);

const progress = computed(() => {
  if (total.value === 0 || totalPayments.value === 0) return 0;
  return 100 / (total.value / totalPayments.value);
});

const props = withDefaults(defineProps<InvoicePaymentsBarProps>(), {});
</script>
