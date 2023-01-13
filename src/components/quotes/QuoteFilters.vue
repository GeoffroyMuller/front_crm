<template>
  <MagicFilterBar
    :store="quotesStore"
    :map="{
      '$contains.name': 'name',
      '$eq.status': 'status',
    }"
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
</script>
