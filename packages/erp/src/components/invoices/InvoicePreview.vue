<template>
  <Sidebar v-model:open="isOpen" class="sidebar-invoice-preview">
    <Iframe v-bind="{ ...iframeprops }" class="invoice-iframe" />
  </Sidebar>
</template>

<script setup lang="ts">
import Sidebar from "core/src/components/Sidebar.vue";
import Iframe from "core/src/components/Iframe.vue";
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
const iframeprops = ref();

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
      iframeprops.value = {
        src: `${config.API_URL}/invoices/${invoice.id}/preview`,
        config: {
          headers: {
            Authorization: getJWT(),
          },
        },
      };
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
