<template>
  <NotificationsContainer>
    <ConfirmModalContainer>
      <PageChangeContainer>
        <component :is="layout">
          <RouterView />
        </component>
      </PageChangeContainer>
    </ConfirmModalContainer>
  </NotificationsContainer>
</template>

<script setup lang="ts">
import * as yup from "yup";
import { computed, watch } from "vue";
import { RouterView, useRoute } from "vue-router";

import LayoutDefault from "../layouts/LayoutDefault.vue";
import NotificationsContainer from "./providers/NotificationsContainer.vue";
import ConfirmModalContainer from "./providers/ConfirmModalContainer.vue";
import { useI18n } from "vue-i18n";
import PageChangeContainer from "./providers/PageChangeContainer.vue";

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

  return LayoutDefault;
});
</script>
