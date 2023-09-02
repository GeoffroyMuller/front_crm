<template>
  <Sidebar
    v-model:open="isOpen"
    :title="`${$t('quote')} ${quote?.identifier || ''}`"
    padding
  >
    <SidebarContent>
      <PdfViewer
        v-if="isOpen"
        :src="generateQuotePDF(quote, { output: 'datauristring' })"
        :initialZoom="0.9"
      />
    </SidebarContent>
  </Sidebar>
</template>

<script setup lang="ts">
import useQuoteStore from "../../stores/quotes";
import type { Quote } from "../../types";
import Sidebar from "core/src/components/sidebar/Sidebar.vue";
import { ref, watch } from "vue";
import PdfViewer from "core/src/components/PdfViewer.vue";
import SidebarContent from "core/src/components/sidebar/SidebarContent.vue";
import { generateQuotePDF } from "@megaapp/pdfs";
interface QuotePreviewProps {
  quote?: Quote | null;
}

const props = withDefaults(defineProps<QuotePreviewProps>(), {});
const emit = defineEmits(["close"]);

const quoteStore = useQuoteStore();
const loading = ref(false);

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
