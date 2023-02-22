<template>
  <Sidebar v-model:open="isOpen" class="sidebar-invoice-preview">
    <iframe ref="iframe" class="invoice-iframe" />
  </Sidebar>
</template>

<script setup lang="ts">
import Sidebar from "core/src/components/Sidebar.vue";
import { ref, watch } from "vue";
import config from "@/const";
import { getJWT } from "core/src/helpers/utils";
import type Invoice from "@/types/invoice";

interface SidebarPreviewProps {
  invoice?: Invoice | null;
}

const props = withDefaults(defineProps<SidebarPreviewProps>(), {});
const emit = defineEmits(["close"]);

const isOpen = ref(false);
const iframe = ref();

watch(
  () => isOpen.value,
  (open) => {
    if (!open) {
      emit("close");
    }
  }
);

watch(
  () => props.invoice,
  (invoice) => {
    if (invoice == null) {
      isOpen.value = false;
    } else {
      isOpen.value = true;
      iframe.value.src = `${config.API_URL}/invoices/${
        invoice.id
      }/preview?token=${getJWT()}`;
    }
  },
  { immediate: true }
);
</script>

<style lang="scss">
.invoice-iframe {
  width: 65vw;
  height: 100vh;
}

@include media-down(md) {
  .invoice-iframe {
    width: 100vw;
  }
}
</style>
