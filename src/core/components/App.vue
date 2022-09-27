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
import { computed } from "vue";
import { RouterView, useRoute } from "vue-router";

import Default from "@/features/layouts/Default.vue";
import NotificationsContainer from "./providers/NotificationsContainer.vue";
import ConfirmModalContainer from "./providers/ConfirmModalContainer.vue";

const route = useRoute();

const layout = computed(() => {
  if (route?.meta?.layout) {
    return route.meta.layout;
  }

  return Default;
});
</script>
