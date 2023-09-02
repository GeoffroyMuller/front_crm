<template>
  <Sidebar
    :display-close-btn="false"
    :open="open"
    @update:open="($val) => !$val && emit('close')"
  >
    <SidebarHead
      :title="title"
      :actions="[
        { title: t('edit'), icon: 'edit', action: 'edit', main: true },
        {
          title: t('archive'),
          icon: 'archive',
          action: 'setArchived',
          main: true,
          color: 'danger',
        },
        {
          icon: 'mail',
          action: 'sendMail',
          title: t('send_by_mail'),
          main: true,
          color: 'success',
        },
        { icon: 'download', action: 'downloadPdf', title: t('download') },
        {
          icon: 'request_quote',
          action: 'invoice',
          title: t('pages.quotes.create_invoice'),
        },
      ]"
      @action="($action) => $emit($action, quote)"
    />
    <SidebarContent>
      <PdfViewer
        v-if="quote"
        :key="quote?.id"
        :src="generateQuotePDF(quote, { output: 'datauristring' })"
        :initialZoom="0.9"
      />
    </SidebarContent>
  </Sidebar>
</template>
<script lang="ts" setup>
import Sidebar from "core/src/components/sidebar/Sidebar.vue";
import SidebarHead from "core/src/components/sidebar/SidebarHead.vue";
import SidebarContent from "core/src/components/sidebar/SidebarContent.vue";
import type { Quote } from "../../types";
import { computed } from "vue";
import useQuoteStore from "../../stores/quotes";
import { useI18n } from "vue-i18n";
import { merge } from "lodash";
import PdfViewer from "core/src/components/PdfViewer.vue";
import { generateQuotePDF } from "@megaapp/pdfs";

const props = defineProps<{ open: boolean; model?: Quote }>();
const emit = defineEmits(["close"]);

const quotesStore = useQuoteStore();
const { t } = useI18n();

const quote = computed<Quote>(() => {
  if (props.model != null) {
    return merge(props.model, quotesStore.getById(props.model.id));
  }
  return null;
});

const title = computed<string>(() => {
  if (quote.value == null) return "";
  if (quote.value?.name) return quote.value?.name;

  return `${t("pages.quotes.quote")} ${quote.value.client.firstname} ${
    quote.value.client.lastname
  }`;
});
</script>
