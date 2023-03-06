<template>
  <Sidebar v-model:open="isOpen" class="sidebar-quote-preview">
    <Iframe class="quote-iframe" v-bind="{ ...iframeprops }" />
  </Sidebar>
</template>

<script setup lang="ts">
import type { Quote } from "@/types/quote";
import Sidebar from "core/src/components/Sidebar.vue";
import Iframe from "core/src/components/Iframe.vue";
import { ref, watch } from "vue";
import config from "@/const";
import { getJWT } from "core/src/helpers/utils";

interface QuotePreviewProps {
  quote?: Quote | null;
}

const props = withDefaults(defineProps<QuotePreviewProps>(), {});
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
  () => props.quote,
  (quote) => {
    if (quote == null) {
      isOpen.value = false;
    } else {
      isOpen.value = true;
      iframeprops.value = {
        src: `${config.API_URL}/quotes/${quote.id}/preview`,
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
.quote-iframe {
  width: 65vw;
  height: 100vh;
}

@include media-down(md) {
  .quote-iframe {
    width: 100vw;
  }
}
</style>
