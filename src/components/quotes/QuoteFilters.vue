<template>
  <MagicFilterBar
    :store="quotesStore"
    :columns="2"
    :gap="1"
    :map="{
      name: '$contains.name',
      status: '$eq.status',
      test: ['$or.$contains.name', '$or.$contains.status'],
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
      {
        type: 'string',
        props: { name: 'test', label: 'test' },
      },
    ]"
  />
</template>
<script setup lang="ts">
import MagicFilterBar from "@/core/components/magic/MagicFilterBar.vue";
import useQuoteStore from "@/stores/quotes";

const quotesStore = useQuoteStore();
</script>
