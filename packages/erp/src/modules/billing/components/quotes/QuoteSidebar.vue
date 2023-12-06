<template>
  <Sidebar
    :display-close-btn="false"
    :open="open"
    @update:open="($val) => !$val && emit('close')"
    contentClass="flex flex-col overflow-hidden md:min-w-[800px] md:max-w-[800px]"
  >
    <SidebarHead
      :actions="actions"
      @action="($action) => $emit($action, quote)"
    >
      <template #title>
        <div class="flex items-center gap-4">
          <div>
            {{ title }}
          </div>
          <Chip color="danger" v-if="quote?.archived">
            {{ $t("archived") }}
          </Chip>
        </div>
      </template>
    </SidebarHead>

    <SidebarContent class="flex-1 overflow-hidden">
      <PdfViewer
        v-if="quote"
        :key="quote?.id"
        class="max-h-full"
        :src="`${config.API_URL}/quotes/${quote.id}/pdf?token=${getJWT()}`"
      />
    </SidebarContent>
  </Sidebar>
</template>
<script lang="ts" setup>
import Sidebar from "core/src/components/sidebar/Sidebar.vue";
import SidebarHead, {
  type SidebarHeadAction,
} from "core/src/components/sidebar/SidebarHead.vue";
import SidebarContent from "core/src/components/sidebar/SidebarContent.vue";
import type { Quote } from "../../types";
import { computed } from "vue";
import useQuoteStore from "../../stores/quotes";
import { useI18n } from "vue-i18n";
import { merge } from "lodash";
import PdfViewer from "core/src/components/PdfViewer.vue";
import { ref } from "vue";
import config from "@/const";
import { getJWT } from "core/src/helpers/utils";
import Chip from "core/src/components/Chip.vue";

const props = defineProps<{ open: boolean; model?: Quote }>();
const emit = defineEmits(["close"]);

const quotesStore = useQuoteStore();
const { t } = useI18n();

const quotePDFSrc = ref();

const actions = computed<SidebarHeadAction[]>(() => {
  const res: SidebarHeadAction[] = [
    { title: t("edit"), icon: "edit", action: "edit", main: true },
    {
      icon: "mail",
      action: "sendMail",
      title: t("send_by_mail"),
      main: true,
      color: "success",
    },
    {
      icon: "download",
      action: "downloadPdf",
      title: t("download"),
    },
    {
      icon: "request_quote",
      action: "invoice",
      title: t("pages.quotes.create_invoice"),
    },
  ];
  if (!quote.value?.archived) {
    res.push({
      title: t("archive"),
      icon: "archive",
      action: "setArchived",
      color: "danger",
    });
  }
  return res;
});

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
