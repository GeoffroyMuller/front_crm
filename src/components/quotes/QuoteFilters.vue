<template>
  <MagicFilterBar
    :store="quotesStore"
    :map-form-filters="mapFormFilters"
    :filters="[
      { type: 'string', props: { name: 'name', label: 'title' } },
      {
        type: 'select',
        props: {
          name: 'status',
          label: 'status',
          options: ['draft', 'refused', 'validated'],
        },
      },
    ]"
  />
</template>
<script setup lang="ts">
import MagicFilterBar from "@/core/components/magic/MagicFilterBar.vue";
import useQuoteStore from "@/stores/quotes";

const quotesStore = useQuoteStore();

function mapFormFilters(form: any) {
  const filters: any = {
    $eq: {},
    $contains: { name: form.name },
  };
  if (form.status != null) {
    filters.$eq.status = form.status;
  }
  return filters;
}
</script>
