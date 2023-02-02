<template>
  <Page
    :title="`${$t('invoice')} ${invoice?.identifier || ''}`"
    back
    :loading="!invoice"
  >
    <Grid :gap="1">
      <pre class="code" :style="{ maxHeight: '220px' }">{{ invoice }}</pre>
      <Flex :gap="1">
        <Button @click="$router.push(`/invoices/${id}/edit`)">
          {{ $t("edit") }}
        </Button>
      </Flex>
      <InvoicePayments :invoice="invoice" />
    </Grid>
  </Page>
</template>

<script setup lang="ts">
import InvoicePayments from "@/components/invoices/InvoicePayments.vue";
import Page from "@/components/Page.vue";
import Button from "@/core/components/Button.vue";
import Flex from "@/core/components/layouts/Flex.vue";
import Grid from "@/core/components/layouts/Grid.vue";
import useUI from "@/core/helpers/vue/composables/ui";
import useClientStore from "@/stores/clients";
import useInvoicesStore from "@/stores/invoices";
import useVatStore from "@/stores/vat";
import type Invoice from "@/types/invoice";
import { computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter, useRoute } from "vue-router";

const invoiceStore = useInvoicesStore();
const clientsStore = useClientStore();
const vatsStore = useVatStore();

const router = useRouter();
const { id } = useRoute().params;
const { t } = useI18n();
const { toast, confirm } = useUI();

const invoice = computed<Invoice>(() => invoiceStore.getById(id as string));

onMounted(() => {
  vatsStore.fetchList();
  invoiceStore
    .fetchById(id as string, {
      populate: [
        "client.company",
        "responsible.company",
        "lines.vat",
        "payments",
      ],
    })
    .catch((err) => {
      console.error(err);
    });
});
</script>
