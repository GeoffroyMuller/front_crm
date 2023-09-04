<template>
  <div
    class="fixed top-0 right-0 z-[998] w-full h-[2px] bg-primary-100 shadow-lg"
    v-if="displayLoadingPage"
  >
    <div
      class="bg-primary-600 h-full animation-loading-page shadow-lg shadow-primary-600"
    />
  </div>
  <slot />
</template>
<script setup lang="ts">
import useUI from "../../composables/ui";
import { useRouter } from "vue-router";
import type { Confirmation } from "../types";
import { ref } from "vue";
import { provide } from "vue";
import type { Ref } from "vue";

const router = useRouter();
const { confirm } = useUI();
const displayLoadingPage = ref(false);

// Condition page blocked
const changePageConfirmationMessage = ref<Confirmation | string>();
const isPageChangeBlocked = ref<() => boolean | Promise<boolean>>();

export type PageChangeConditionInject = {
  changePageConfirmationMessage: Ref<Confirmation | string>;
  isPageChangeBlocked: Ref<() => boolean | Promise<boolean>>;
};

router.beforeEach(async (from, to, next) => {
  if (
    changePageConfirmationMessage.value == null ||
    !isPageChangeBlocked?.value?.() ||
    (await confirm(changePageConfirmationMessage.value))
  ) {
    next();
    changePageConfirmationMessage.value = undefined;
    isPageChangeBlocked.value = undefined;
  }
});

//Display page load
router.beforeEach((to, from, next) => {
  displayLoadingPage.value = true;
  next();
});
router.afterEach((to, from) => {
  displayLoadingPage.value = false;
});

provide("page-change-condition", {
  changePageConfirmationMessage,
  isPageChangeBlocked,
});
</script>

<style lang="scss">
@keyframes loadingpage {
  0% {
    width: 25%;
  }
  50% {
    width: 85%;
  }
  100% {
    width: 100%;
  }
}
.animation-loading-page {
  animation: loadingpage 8s linear infinite;
}
</style>
