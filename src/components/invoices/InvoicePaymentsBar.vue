<template>
  <div class="invoice-payments-progress">
    <div>
      {{ $utils.formatPrice(totalPayments) }}
    </div>
    <ProgressBar :progress="progress" />
  </div>
</template>

<script setup lang="ts">
import ProgressBar from "@/core/components/ProgressBar.vue";
import type Invoice from "@/types/invoice";
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

<style lang="scss">
.invoice-payments-progress {
  color: color("primary", 500);
  font-size: 0.85rem;
  :first-child {
    margin-bottom: spacing(0.5);
  }
}
</style>
