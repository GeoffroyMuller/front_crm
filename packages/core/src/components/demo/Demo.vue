<template>
  <Tabs :tabs="tabs">
    <template #buttons>
      <DemoButtons />
    </template>
    <template #cards>
      <DemoCard />
    </template>
    <template #toast>
      <DemoToast />
    </template>
  </Tabs>
</template>

<script setup lang="ts">
import Tabs from '../Tabs.vue';
import DemoButtons from './DemoButtons.vue';
import DemoCard from './DemoCard.vue';
import DemoToast from './DemoToast.vue';

const tabs = [
  { id: 'buttons', title: 'buttons' },
  { id: 'cards', title: 'cards' },
  { id: 'toast', title: 'toast'}
]
</script>