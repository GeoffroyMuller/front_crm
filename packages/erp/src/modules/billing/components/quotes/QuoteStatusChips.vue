<template>
  <Chip :color="statusColor">{{ statusLabel }}</Chip>
</template>

<script lang="ts" setup>
import Chip from "core/src/components/Chip.vue";
import { QuoteValidationStatus, type Quote } from "../../types";
import { useI18n } from "vue-i18n";
import { computed } from "vue";
import type { Color } from "core/src/components/types";

const { t } = useI18n();

const props = defineProps<{
  quote: Quote;
}>();

const statusLabel = computed(() => {
  if (props.quote.validationStatus == null) return t(`data.status.draft`);
  const quoteValidationStatusKey = Object.keys(QuoteValidationStatus).find(
    // @ts-ignore
    (key: string) => QuoteValidationStatus[key] == props.quote.validationStatus
  );
  if (quoteValidationStatusKey == null) return " - ";
  return t(`data.status.${quoteValidationStatusKey.toLowerCase()}`);
});

const statusColor = computed<Color>(() => {
  if (props.quote.validationStatus === QuoteValidationStatus.REFUSED) {
    return "danger";
  } else if (props.quote.validationStatus === QuoteValidationStatus.VALIDATED) {
    return "success";
  }
  return "white";
});
</script>
