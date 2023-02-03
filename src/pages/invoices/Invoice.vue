<template>
  <Page
    :title="`${$t('invoice')} ${invoice?.identifier || ''}`"
    back
    :loading="!invoice"
  >
    <Grid :gap="1">
      <!-- <pre class="code" :style="{ maxHeight: '220px' }">{{ invoice }}</pre> -->
      <Flex :gap="1">
        <Button @click="$router.push(`/invoices/${id}/edit`)">
          {{ $t("edit") }}
        </Button>
      </Flex>

      <Card>
        <Grid :gap="5" :columns="1">
          <div class="subtitle">{{ invoice.name }}</div>
          <Flex justify-content="space-between">
            <Flex
              direction="column"
              justify-content="center"
              align-items="flex-start"
            >
              <div class="invoice-user-title">{{ $t("responsible") }}:</div>
              <div class="text2">
                {{ invoice.responsible.firstname }}
                {{ invoice.responsible.lastname }}
              </div>
              <div class="text2">
                {{ invoice.responsible.email }}
              </div>
            </Flex>
            <Flex
              direction="column"
              justify-content="center"
              align-items="flex-end"
            >
              <div>
                <div class="invoice-user-title">{{ $t("customer") }}:</div>
                <div class="text2">
                  {{ invoice.client?.firstname }} {{ invoice.client?.lastname }}
                </div>
                <div class="text2">
                  {{ invoice.client?.address }}
                </div>
              </div>
            </Flex>
          </Flex>

          <Grid :gap="1" :columns="1">
            <div v-for="line in invoice.lines" :key="line.id">
              <Card>
                <Grid :gap="1" :columns="4">
                  <Grid :gap="1" :columns="1">
                    <div class="text">{{ $t("description") }}:</div>
                    <div class="text2" v-html="line.description"></div>
                  </Grid>
                  <Grid v-if="line.qty" :gap="1" :columns="1">
                    <div class="text">{{ $t("quantity") }}:</div>
                    <div class="text2">{{ line.qty }}</div>
                  </Grid>
                  <Grid v-if="line.unit_price" :gap="1" :columns="1">
                    <div class="text">{{ $t("unit-price") }}:</div>
                    <div class="text2">
                      {{ $utils.formatPrice(line.unit_price!) }}
                    </div>
                  </Grid>
                  <Grid v-if="line.vat" :gap="1" :columns="1">
                    <div class="text">{{ $t("vat") }}:</div>
                    <div class="text2">{{ line.vat.rate }}%</div>
                  </Grid>
                </Grid>
              </Card>
            </div>
          </Grid>
          <Grid v-if="invoice.modalities" :gap="1" :columns="1">
            <div class="text">{{ $t("modalities") }}:</div>
            <div class="text2" v-html="invoice.modalities"></div>
          </Grid>
          <Grid v-if="invoice.footer" :gap="1" :columns="1">
            <div class="text">{{ $t("footer") }}:</div>
            <div class="text2" v-html="invoice.footer"></div>
          </Grid>
        </Grid>
      </Card>

      <InvoicePayments :invoice="invoice" />
    </Grid>
  </Page>
</template>

<script setup lang="ts">
import InvoicePayments from "@/components/invoices/InvoicePayments.vue";
import Page from "@/components/Page.vue";
import Button from "@/core/components/Button.vue";
import Card from "@/core/components/Card.vue";
import Flex from "@/core/components/layouts/Flex.vue";
import Grid from "@/core/components/layouts/Grid.vue";
import useUI from "@/core/helpers/vue/composables/ui";
import useClientStore from "@/stores/clients";
import useInvoicesStore from "@/stores/invoices";
import useVatStore from "@/stores/vat";
import type Invoice from "@/types/invoice";
import { computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";

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
<style lang="scss" scoped>
.invoice-user-title {
  @include typo(text);
  margin-bottom: spacing(1);
}
</style>
