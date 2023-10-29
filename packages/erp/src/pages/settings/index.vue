<template>
  <Page :title="$t('settings')" icon="settings" :tabs="settings">
    <template v-for="setting in settings" :key="setting.id" v-slot:[setting.id]>
      <component :is="setting.component"></component>
    </template>
  </Page>
</template>

<script setup lang="ts">
import Page from "core/src/components/Page.vue";
import { useI18n } from "vue-i18n";

import Roles from "./Roles.vue";
import Teams from "./Teams.vue";

const { t } = useI18n();

const settings = [
  {
    id: "roles",
    title: t("roles"),
    component: Roles,
  },
  {
    id: "teams",
    title: t("teams"),
    component: Teams,
  },
  /* {
    id: "comm_fee",
    title: t("settings-page.commission-fee.title"),
    component: ComissionFee,
  }, */
];
</script>
