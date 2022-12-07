<template>
  <Sidebar v-model:open="isOpen" class="sidebar-quote-preview">
    <iframe
      v-if="quote"
      width="100%"
      :src="`${config.API_URL}/quotes/${quote.id}/preview?token=${getJWT()}`"
      class="quote-iframe"
    />
  </Sidebar>
</template>

<script setup lang="ts">
import type { Quote } from "@/types/quote";
import Sidebar from "@/core/components/Sidebar.vue";
import { ref, watch } from "vue";
import config from "@/const";
import { getJWT } from "@/core/helpers/utils";

interface QuotePreviewProps {
  quote?: Quote | null;
}

const props = withDefaults(defineProps<QuotePreviewProps>(), {});
const emit = defineEmits(["close"]);

const isOpen = ref(false);

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

@media screen and (max-width: 900px) {
  .quote-iframe {
    width: 100vw;
  }
}
</style>
