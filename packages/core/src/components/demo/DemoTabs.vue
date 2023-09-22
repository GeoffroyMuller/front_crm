<template>
  <Tabs :tabs="tabs">
    <template #test> TEST CONTENT </template>
    <template #test2> TEST 2 CONTENT </template>
    <template #test4>
      <button @click="onClickChangeTabs()">CHANGE TABS</button>
    </template>
  </Tabs>
</template>

<script setup lang="ts">
import type { Tab } from "src/composables/tabs";
import Tabs from "../Tabs.vue";
import { ref } from "vue";

function onClickChangeTabs() {
  tabs.value = [
    {
      id: "x",
      title: "Tab1",
    },
    {
      id: "y",
      title: "Tab2",
    },
  ];
}

const tabs = ref<Tab[]>([
  {
    id: "test",
    title: "lorem ipsum lorem ipsum",
  },
  {
    id: "test2",
    title: "lorem ipsum lorem ipsum",
  },
  {
    id: "test3",
    title: "lorem ipsum lorem ipsum",
  },
  {
    id: "test4",
    title: "lorem ipsum lorem ipsum",
  },
]);
</script>
