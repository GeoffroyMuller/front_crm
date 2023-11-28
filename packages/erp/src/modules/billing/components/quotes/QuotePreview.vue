<template>
  <Sidebar
    v-model:open="isOpen"
    :title="`${$t('quote')} ${quote?.identifier || ''}`"
    padding
    contentClass="overflow-hidden md:min-w-[800px] md:max-w-[800px]"
  >
    <SidebarContent class="h-full">
      <PdfViewer
        class="h-full"
        v-if="isOpen"
        :src="`${config.API_URL}/quotes/${quote.id}/pdf?token=${getJWT()}`"
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
import config from "@/const";
import { getJWT } from 'core/src/helpers/utils';

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
