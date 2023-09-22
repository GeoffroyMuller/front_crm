<template>
  <Page
    title="Demo"
    icon="tools_wrench"
    :tabs="tabs.map((t) => ({ id: t.id, title: t.id }))"
    page-head-fixed
  >
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
    <template #inputs>
      <DemoInput />
    </template>
    <template #menu>
      <DemoMenu />
    </template>
    <template #typo>
      <DemoTypo />
    </template>
    <template #breadcrumb>
      <DemoBreadcrumb />
    </template>
    <template #kanban>
      <DemoKanban />
    </template>
  </Page>
</template>

<script setup lang="ts">
import Tabs from "../Tabs.vue";
import Page from "../Page.vue";
import DemoButtons from "./DemoButtons.vue";
import DemoCard from "./DemoCard.vue";
import DemoToast from "./DemoToast.vue";
import DemoColor from "./DemoColor.vue";
import DemoChips from "./DemoChips.vue";
import DemoInput from "./DemoInput.vue";
import DemoMenu from "./DemoMenu.vue";
import DemoTypo from "./DemoTypo.vue";
import DemoBreadcrumb from "./DemoBreadcrumb.vue";
import DemoKanban from "./DemoKanban.vue";

const tabs = [
  { id: "menu" },
  { id: "color" },
  { id: "buttons" },
  { id: "cards" },
  { id: "toast" },
  { id: "chips" },
  { id: "inputs" },
  { id: "typo" },
  { id: "breadcrumb" },
  { id: "kanban" },
];
</script>
