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
        <Grid :gap="2" :columns="1">
          <div class="invoice-title">{{ invoice.name }}</div>
          <Flex justify-content="space-between">
            <Flex
              direction="column"
              justify-content="center"
              align-items="flex-start"
              class="invoice-user"
            >
              <div class="user-title">{{ $t("responsible") }}:</div>
              <div class="user-info">
                {{ invoice.responsible.firstname }}
                {{ invoice.responsible.lastname }}
              </div>
              <div class="user-info">
                {{ invoice.responsible.email }}
              </div>
            </Flex>
            <Flex
              direction="column"
              justify-content="center"
              align-items="flex-end"
              class="invoice-user"
            >
              <div>
                <div class="user-title">{{ $t("customer") }}:</div>
                <div class="user-info">
                  {{ invoice.client?.firstname }} {{ invoice.client?.lastname }}
                </div>
                <div class="user-info">
                  {{ invoice.client?.address }}
                </div>
              </div>
            </Flex>
          </Flex>

          <Grid :gap="1" :columns="1">
            <div v-for="line in invoice.lines" :key="line.id">
              <Card>
                <Grid :gap="1" :columns="3">
                  <Grid :gap="1" :columns="1">
                    <div class="line-title">{{ $t("description") }}:</div>
                    <div class="line-content" v-html="line.description"></div>
                  </Grid>
                  <Grid :gap="1" :columns="1">
                    <div class="line-title">{{ $t("unit-price") }}:</div>
                    <div class="line-content">
                      {{ $utils.formatPrice(line.unit_price!) }}
                    </div>
                  </Grid>
                  <Grid v-if="line.qty" :gap="1" :columns="1">
                    <div class="line-title">{{ $t("quantity") }}:</div>
                    <div class="line-content">{{ line.qty }}</div>
                  </Grid>
                </Grid>
              </Card>
            </div>
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
.invoice-title {
  @include typo(subtitle);
}
.invoice-user {
  .user-title {
    @include typo(text);
    margin-bottom: spacing(1);
  }
  .user-info {
    @include typo(text2);
  }
}
.line-title {
  @include typo(text2);
}
.line-content {
  @include typo(text);
}
</style>
