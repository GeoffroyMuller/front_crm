<template>
  <slot />
</template>
<script setup lang="ts">
import useUI from "../../composables/ui";
import { useRouter } from "vue-router";
import type { Confirmation } from "../types";
import { ref } from "vue";
import { provide } from "vue";

const router = useRouter();
const { confirm } = useUI();

const changePageConfirmationMessage = ref<Confirmation | string>();

router.beforeEach(async (from, to, next) => {
  if (
    changePageConfirmationMessage.value == null ||
    (await confirm(changePageConfirmationMessage.value))
  ) {
    next();
    changePageConfirmationMessage.value = undefined;
  }
});

provide("page-change-condition", changePageConfirmationMessage);
</script>
