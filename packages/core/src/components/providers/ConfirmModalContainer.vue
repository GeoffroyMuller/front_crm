<template>
  <Modal
    :open="confirmOpen"
    @update:open="cancelConfirm"
    :title="confirmationData?.title"
  >
    <div>{{ confirmationData?.message }}</div>
    <div class="actions">
      <Button variant="text" color="black" @click="cancelConfirm">
        {{ $t("cancel") }}
      </Button>
      <Button color="primary" @click="confirmConfirm">
        {{ $t("confirm") }}
      </Button>
    </div>
  </Modal>
  <slot />
</template>

<script setup lang="ts">
import { ref, computed, provide, watch } from "vue";
import type { Confirmation } from "../types";
import { isNil } from "lodash";
import Modal from "../Modal.vue";
import Button from "../Button.vue";

const confirmation = ref<Confirmation | string | null>(null);
const confirmationResponse = ref<boolean | null>(null);

const confirmOpen = computed(() => !isNil(confirmation.value));

const confirmationData = computed<Confirmation | null>(() => {
  const confirmationDefaultData = {
    title: "",
    type: "info",
  };

  if (isNil(confirmation.value)) {
    return null;
  }
  if (typeof confirmation.value === "string") {
    return {
      ...confirmationDefaultData,
      message: confirmation.value,
    } as Confirmation;
  }
  return {
    ...confirmationDefaultData,
    ...confirmation.value,
  } as Confirmation;
});

async function confirm(c: Confirmation | string) {
  return new Promise((resolve) => {
    confirmation.value = c;
    const unwatchResponse = watch(
      () => confirmationResponse.value,
      () => {
        if (typeof confirmationResponse.value === "boolean") {
          resolve(confirmationResponse.value);
          unwatchResponse();
          confirmationResponse.value = null;
          confirmation.value = null;
        }
      }
    );
  });
}
function confirmConfirm() {
  confirmationResponse.value = true;
}

function cancelConfirm() {
  confirmationResponse.value = false;
}

provide("confirmation", confirm);
</script>

<style scoped lang="scss">
.actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: spacing(2);
}
</style>
