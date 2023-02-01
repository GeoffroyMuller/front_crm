<template>
  <Page :title="title" :loading="loading" back>
</template>
<script setup lang="ts">
import Page from "@/components/Page.vue";
import useUI from "@/core/helpers/vue/composables/ui";
import useClientStore from "@/stores/clients";
import useInvoicesStore from "@/stores/invoices";
import useQuoteStore from "@/stores/quotes";
import useVatStore from "@/stores/vat";
import type Client from "@/types/client";
import type Invoice from "@/types/invoice";
import type { Quote } from "csstype";
import { ref, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter, useRoute } from "vue-router";
import { isEmpty } from "lodash";

const invoiceStore = useInvoicesStore();
const clientsStore = useClientStore();
const vatsStore = useVatStore();

const router = useRouter();
const { id } = useRoute().params;
const { t } = useI18n();
const { toast } = useUI();

const isAddClientOpen = ref(false);
const idClient = ref();
const clientOptions = ref();

const isAddAction = computed(
  () => !invoice.value && (!id || Number.isNaN(Number.parseInt(id as string)))
);
const loading = computed(() => {
  return isAddAction.value ? false : !invoice.value;
});

const invoice = ref<Invoice | null>(null);

const title = computed(() => {
  if (isAddAction.value) {
    return t("new-invoice");
  }
  return `${t("invoice")} ${invoice.value?.identifier || ""}`;
});

onMounted(() => {
  vatsStore.fetchList();
  if (!isAddAction.value) {
    invoiceStore
      .fetchById(id, {
        populate: ["client.company", "responsible.company", "lines.vat"],
      })
      .then((res) => {
        invoice.value = res;
      })
      .catch((err) => {
        console.error(err);
      });
  }
});

function onAddClient(client: Client) {
  idClient.value = client.id;
  clientOptions.value = [client];
}

async function handleSubmit(data: Invoice) {
  if (data.lines) {
    data.lines = data.lines
      .map((line) => {
        const newLine = { ...line };
        delete newLine.vat;
        return newLine;
      })
      .filter((line) => !isEmpty(line));
  }
  delete data.client;
  try {
    if (!isAddAction.value) {
      await invoiceStore.update((invoice.value as Invoice).id, data);
    } else {
      const res = await invoiceStore.create(data);
      router.push("/quotes/" + res.id);
      invoice.value = res;
    }
    toast({
      type: "success",
      message: t(`saved`),
    });
  } catch (err) {
    toast({
      type: "danger",
      message: err.response.data.message,
    });
  }
}
</script>
