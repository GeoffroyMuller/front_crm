<template>
  <Modal :open="confirmOpen" @update:open="cancelConfirm">
    <ModalHead :title="confirmationData?.title || $t('core.confirmation')">
      <template #start>
        <Icon :name="icon" :color="color" />
      </template>
    </ModalHead>
    <ModalContent class="flex items-center gap-2">
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
import type { Color, Confirmation, IconName } from "../types";
import { isNil } from "lodash";
import Modal from "../modal/Modal.vue";
import Button from "../Button.vue";
import ModalActions from "../modal/ModalActions.vue";
import ModalContent from "../modal/ModalContent.vue";
import ModalHead from "../modal/ModalHead.vue";
import Icon from "../Icon.vue";

const confirmation = ref<Confirmation | string | null>(null);
const confirmationResponse = ref<boolean | null>(null);

const confirmOpen = ref(false);

const icon = computed<IconName>(() => {
  switch (confirmationData?.value?.type) {
    case "success":
      return "check";
    case "danger":
      return "dangerous";
    case "warning":
      return "warning";
    default:
      return "info";
  }
});

const color = computed<Color>(() => {
  switch (confirmationData?.value?.type) {
    case "success":
      return "success";
    case "danger":
      return "danger";
    case "warning":
      return "warning";
    default:
      return "primary";
  }
});

const confirmationData = computed<Confirmation | null>(() => {
  const confirmationDefaultData = {
    title: "",
    type: "warning",
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
