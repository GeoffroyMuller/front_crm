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
    <template #color>
      <DemoColor />
    </template>
    <template #chips>
      <DemoChips />
    </template>
  </Tabs>
</template>

<script setup lang="ts">
import Tabs from '../Tabs.vue';
import DemoButtons from './DemoButtons.vue';
import DemoCard from './DemoCard.vue';
import DemoToast from './DemoToast.vue';
import DemoColor from './DemoColor.vue';
import DemoChips from './DemoChips.vue';

const tabs = [
  { id: 'color', title: 'color' },
  { id: 'buttons', title: 'buttons' },
  { id: 'cards', title: 'cards' },
  { id: 'toast', title: 'toast' },
  { id: 'chips', title: 'chips' },
]
</script>