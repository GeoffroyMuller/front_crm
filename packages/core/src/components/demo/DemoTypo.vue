<template>
  <div class="flex">
    <div v-for="bold in bolds" :key="bold" class="grid gap-4">
      <div class="typo-title1 text-primary-500 mb-4">{{ bold }}</div>
      <div
        v-for="typo of typos"
        :key="typo"
        :class="`typo-${typo} typo-${bold}`"
      >
        {{ typo }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const typos = [
  "title1",
  "title2",
  "title3",
  "title4",
  "title5",
  "title6",
  "title7",
  "text1",
  "button",
  "label",
];

const bolds = ["regular", "bold"];
</script>
