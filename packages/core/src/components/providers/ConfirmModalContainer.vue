<template>
  <Modal
    :open="confirmOpen"
    @update:open="cancelConfirm"
    :title="confirmationData?.title"
  >
    <ModalContent>
      <div>{{ confirmationData?.message }}</div>
    </ModalContent>
    <ModalActions>
      <Button variant="text" color="black" @click="cancelConfirm">
        {{ $t("cancel") }}
      </Button>
      <Button color="primary" @click="confirmConfirm">
        {{ $t("confirm") }}
      </Button>
    </ModalActions>
  </Modal>
  <slot />
</template>

<script setup lang="ts">
import { ref, computed, provide, watch } from "vue";
import type { Confirmation } from "../types";
import { isNil } from "lodash";
import Modal from "../modal/Modal.vue";
import Button from "../Button.vue";
import ModalActions from "../modal/ModalActions.vue";
import ModalContent from "../modal/ModalContent.vue";

const confirmation = ref<Confirmation | string | null>(null);
const confirmationResponse = ref<boolean | null>(null);

const confirmOpen = ref(false);

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
    confirmOpen.value = true;
    const unwatchResponse = watch(
      () => confirmationResponse.value,
      () => {
        if (typeof confirmationResponse.value === "boolean") {
          resolve(confirmationResponse.value);
          unwatchResponse();
          confirmOpen.value = false;
          confirmationResponse.value = null;
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
