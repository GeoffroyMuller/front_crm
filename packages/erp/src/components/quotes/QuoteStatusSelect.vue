<template>
  <Select
    :getOptionLabel="(opt: string) => t(`data.status.${opt}`)"
    name="status"
    :label="$t('status')"
    :options="['draft', 'refused', 'validated']"
  />
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import Select from "core/src/components/form/Select.vue";
const { t } = useI18n();
</script>
