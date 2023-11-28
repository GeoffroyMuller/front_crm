<template>
  <Sidebar
    :display-close-btn="false"
    :open="open"
    @update:open="($val) => !$val && emit('close')"
    contentClass="flex flex-col overflow-hidden md:min-w-[800px] md:max-w-[800px]"
  >
    <SidebarHead
      :title="title"
      :actions="actions"
      @action="($action) => $emit($action, invoice)"
      :tabs="[
        {
          id: 'pdf',
          title: $t('pages.invoices.sidebartabs.pdf'),
        },
        {
          id: 'payments',
          title: $t('pages.invoices.sidebartabs.payments'),
        },
      ]"
    />

    <template #pdf>
      <SidebarContent class="flex-1 overflow-hidden">
        <PdfViewer
          v-if="invoice"
          :key="invoice?.id"
          :src="''"
          class="max-h-full"
        />
      </SidebarContent>
    </template>
    <template #payments>
      <SidebarContent>
        <InvoicePayements
          v-if="invoice"
          :key="invoice?.id"
          :invoice="invoice"
        />
      </SidebarContent>
    </template>
  </Sidebar>
</template>
<script lang="ts" setup>
import Sidebar from "core/src/components/sidebar/Sidebar.vue";
import SidebarHead, {
  type SidebarHeadAction,
} from "core/src/components/sidebar/SidebarHead.vue";
import SidebarContent from "core/src/components/sidebar/SidebarContent.vue";
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { merge } from "lodash";
import PdfViewer from "core/src/components/PdfViewer.vue";
import useInvoicesStore from "../../stores/invoices";
import InvoicePayements from "./InvoicePayements.vue";
import type Invoice from "../../types";

const props = defineProps<{ open: boolean; model?: Invoice }>();
const emit = defineEmits(["close"]);

const invoiceStore = useInvoicesStore();
const { t } = useI18n();

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
  ];
  if (!invoice.value?.archived) {
    res.push({
      title: t("archive"),
      icon: "archive",
      action: "setArchived",
      color: "danger",
      main: true,
    });
  }
  return res;
});

const invoice = computed<Invoice>(() => {
  if (props.model != null) {
    return merge(props.model, invoiceStore.getById(props.model.id));
  }
  return null;
});

const title = computed<string>(() => {
  if (invoice.value == null) return "";
  if (invoice.value?.name) return invoice.value?.name;

  return `${t("pages.invoices.quote")} ${
    invoice.value?.client?.firstname || ""
  } ${invoice.value?.client?.lastname || ""}`;
});
</script>
