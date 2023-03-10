<template>
  <NotificationsContainer>
    <ConfirmModalContainer>
      <component :is="layout">
        <RouterView />
      </component>
    </ConfirmModalContainer>
  </NotificationsContainer>
</template>

<script setup lang="ts">
import * as yup from "yup";
import { computed, watch } from "vue";
import { RouterView, useRoute } from "vue-router";

import Default from "../layouts/Default.vue";
import NotificationsContainer from "./providers/NotificationsContainer.vue";
import ConfirmModalContainer from "./providers/ConfirmModalContainer.vue";
import { useI18n } from "vue-i18n";

const route = useRoute();
const { getLocaleMessage, locale } = useI18n();

watch(
  () => locale.value,
  () => {
    const messages = getLocaleMessage(locale.value).validation;
    // @ts-ignore
    const { string, number, date, mixed, array } = messages;
    yup.setLocale({ string, number, date, mixed, array });
  },
  {
    immediate: true,
  }
);

const layout = computed(() => {
  if (route?.meta?.layout) {
    return route.meta.layout;
  }

  return Default;
});
</script>
