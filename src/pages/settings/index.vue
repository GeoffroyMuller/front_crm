<template>
  <Page :title="$t('settings')">
    <Tabs :tabs="settings">
      <template
        v-for="setting in settings"
        :key="setting.id"
        v-slot:[setting.id]
      >
        <component :is="setting.component"></component>
      </template>
    </Tabs>
  </Page>
</template>

<script setup lang="ts">
import Page from "@/components/Page.vue";
import Tabs from "@/core/components/Tabs.vue";
import { useI18n } from "vue-i18n";

import Roles from "./Roles.vue";
import Teams from "./Teams.vue";
import ComissionFee from "./ComissionFee.vue";

const { t } = useI18n();

const settings = [
  {
    id: "roles",
    title: t("roles"),
    component: Roles,
  },
  {
    id: "quotes",
    title: t("teams"),
    component: Teams,
  },
  {
    id: "comm_fee",
    title: t("settings-page.commission-fee.title"),
    component: ComissionFee,
  },
];
</script>
