<template>
  <Page title="Demo" icon="tools_wrench" :tabs="tabs.map((t) => ({ id: t.id, title: t.id }))">
    <template #buttons>
      <Card padding>
        <DemoButtons />
      </Card>
    </template>
    <template #cards>
      <Card padding>
        <DemoCard />
      </Card>
    </template>
    <template #toast>
      <Card padding>
        <DemoToast />
      </Card>
    </template>
    <template #color>
      <Card padding>
        <DemoColor />
      </Card>
    </template>
    <template #chips>
      <Card padding>
        <DemoChips />
      </Card>
    </template>
    <template #inputs>
      <Card padding>
        <DemoInput />
      </Card>
    </template>
    <template #menu>
      <Card padding>
        <DemoMenu />
      </Card>
    </template>
    <template #typo>
      <Card padding>
        <DemoTypo />
      </Card>
    </template>
    <template #breadcrumb>
      <Card padding>
        <DemoBreadcrumb />
      </Card>
    </template>
    <template #tabs>
      <Card padding>
        <DemoTabs />
      </Card>
    </template>
  </Page>
</template>

<script setup lang="ts">
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
import DemoTabs from "./DemoTabs.vue";
import Card from "../card/Card.vue";

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
  { id: "tabs" },
  { id: "wysiwyg" },
];
</script>
