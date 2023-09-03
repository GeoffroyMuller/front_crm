<template>
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

const changePageConfirmationMessage = ref<Confirmation | string>();
const isPageChangeBlocked = ref<() => boolean | Promise<boolean>>();

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

export type PageChangeConditionInject = {
  changePageConfirmationMessage: Ref<Confirmation | string>;
  isPageChangeBlocked: Ref<() => boolean | Promise<boolean>>;
};

provide("page-change-condition", {
  changePageConfirmationMessage,
  isPageChangeBlocked,
});
</script>
