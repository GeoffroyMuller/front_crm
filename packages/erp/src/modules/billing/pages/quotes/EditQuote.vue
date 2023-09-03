<template>
  <Page
    :title="title"
    :loading="loadingPage"
    back
    class="relative"
    :padding="null"
  >
    <div
      class="xl:hidden sticky top-0 w-full flex justify-between items-center bg-white z-20 h-fit py-2 px-4 border-b border-0 border-solid border-b-[#CBD5E1] shadow-[0px_0px_20px_rgba(136,152,170,0.15)]"
    >
      <Text typo="title7" htmlComponent="div">
        {{ $t("pages.edit-quote.total-global") }}
      </Text>
      <div class="flex gap-2 items-center w-fit">
        <Text typo="title7">
          {{ $t("pages.edit-quote.without-taxes") }}
        </Text>
        <Text typo="title3">
          {{ $utils.formatPrice(prices.totalPrice) }}
        </Text>
        <Text typo="title7">{{ $t("pages.edit-quote.with-taxes") }}</Text>
        <Text typo="title3">
          {{ $utils.formatPrice(prices.totalPriceWithTaxes) }}
        </Text>
      </div>
    </div>

    <PageContent padding="large">
      <Form
        shortcuts
        :initial-value="quote"
        @submit="save"
        v-model="formValue"
        class="grid xl:grid-cols-[1fr_min-content] gap-6"
        @update:has-changed="($hc: boolean) => (formHasChanged = $hc)"
      >
        <template #default="{ hasError, hasChanged }">
          <FloatingButton
            :disabled="hasError || !hasChanged"
            :loading="loading"
            type="submit"
            color="success"
            icon="save"
            class="xl:hidden"
          />
          <div class="grid gap-6">
            <div class="grid md:grid-cols-2 w-full gap-6">
              <Card padding class="flex flex-col">
                <TextField name="name" :label="$t('title')" />
                <div
                  class="typo-title5 font-semibold mt-8 flex-1 flex flex-col justify-end"
                >
                  <div class="mb-4">
                    {{ $t("pages.edit-quote.responsible") }}
                  </div>
                  <div class="grid gap-3">
                    <div class="flex gap-2" v-if="auth.company?.name">
                      <div class="text-slate-400">
                        {{ $t("pages.edit-quote.company") }}
                      </div>
                      <div class="text-slate-500">
                        {{ auth.company.name }}
                      </div>
                    </div>
                    <div class="flex gap-2" v-if="auth.company?.siret">
                      <div class="text-slate-400">
                        {{ $t("pages.edit-quote.siret") }}
                      </div>
                      <div></div>
                    </div>
                    <div class="flex gap-2" v-if="auth?.email">
                      <div class="text-slate-400">
                        {{ $t("pages.edit-quote.email") }}
                      </div>
                      <div class="text-slate-500">
                        {{ auth.email }}
                      </div>
                    </div>
                    <div class="flex gap-2" v-if="auth.company?.address">
                      <div class="text-slate-400">
                        {{ $t("pages.edit-quote.address") }}
                      </div>
                      <div class="text-slate-500">
                        {{ auth.company.address }}
                      </div>
                    </div>
                    <div class="flex gap-2" v-if="auth.company?.city">
                      <div class="text-slate-400">
                        {{ $t("pages.edit-quote.city") }}
                      </div>
                      <div class="text-slate-500">
                        {{ auth.company.city }} {{ auth.company.zip_code }}
                      </div>
                    </div>
                    <div class="flex gap-2" v-if="auth?.phone">
                      <div class="text-slate-400">
                        {{ $t("pages.edit-quote.phone") }}
                      </div>
                      <div class="text-slate-500">
                        {{ auth.phone }}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              <Card padding class="flex flex-col">
                <MagicAutocomplete
                  :label="$t('customer')"
                  :store="clientsStore"
                  :get-filters="
                    (str) => ({
                      $or: {
                        $contains: { lastname: str, firstname: str },
                      },
                    })
                  "
                  :getOptionLabel="(opt) => `${opt.firstname} ${opt.lastname}`"
                  :get-option-value="(opt) => opt.id"
                  optionKey="id"
                  name="idClient"
                  :addText="$t(`pages.edit-quote.add-customer`)"
                  can-add
                  @add="isAddClientOpen = true"
                  v-model:options="clientOptions"
                  v-model="idClient"
                />
                <div
                  class="typo-title5 font-semibold mt-8 flex-1 flex flex-col justify-end"
                >
                  <div class="mb-4">
                    {{ $t("pages.edit-quote.customer") }}
                  </div>
                  <div class="grid gap-3">
                    <div class="flex gap-2" v-if="client?.company?.name">
                      <div class="text-slate-400">
                        {{ $t("pages.edit-quote.company") }}
                      </div>
                      <div class="text-slate-500">
                        {{ client?.company?.name }}
                      </div>
                    </div>

                    <!-- <div class="flex gap-2" v-if="client.company?.siret">
                      <div class="text-slate-400">
                        {{ $t("pages.edit-quote.siret") }}
                      </div>
                      <div></div>
                    </div>
                    </div> -->
                    <div class="flex gap-2" v-if="client?.email">
                      <div class="text-slate-400">
                        {{ $t("pages.edit-quote.email") }}
                      </div>
                      <div class="text-slate-500">
                        {{ client.email }}
                      </div>
                    </div>
                    <!--
                      <div class="flex gap-2" v-if="client.company?.address">
                      <div class="text-slate-400">
                        {{ $t("pages.edit-quote.address") }}
                      </div>
                      <div class="text-slate-500">
                        {{ client.company.address }}
                      </div>
                    </div>

                    <div class="flex gap-2" v-if="client.company?.city">
                      <div class="text-slate-400">
                        {{ $t("pages.edit-quote.city") }}
                      </div>
                      <div class="text-slate-500">
                        {{ client.company.city }}
                        {{ client.company.zip_code }}
                      </div>
                    -->
                    <div class="flex gap-2" v-if="client?.phone">
                      <div class="text-slate-400">
                        {{ $t("pages.edit-quote.phone") }}
                      </div>
                      <div class="text-slate-500">
                        {{ client.phone }}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
            <Card padding>
              <Repetable name="lines" :label="$t('products')" orderable>
                <template #default="{ data }">
                  <QuoteLineVue :line="(data as unknown as SaleLine)" />
                </template>
                <template #actions="{ addSection }">
                  <Flex
                    :gap="1.5"
                    flex-wrap="wrap"
                    justify-content="center"
                    align-items="center"
                  >
                    <Button
                      type="button"
                      variant="text"
                      @click="addSection({ type: 'product' })"
                    >
                      {{ $t("pages.edit-quote.add-line-product") }}
                    </Button>
                    <Button
                      type="button"
                      variant="text"
                      @click="addSection({ type: 'comment' })"
                    >
                      {{ $t("pages.edit-quote.add-line-comment") }}
                    </Button>
                    <Button
                      type="button"
                      variant="text"
                      @click="addSection({ type: 'title' })"
                    >
                      {{ $t("pages.edit-quote.add-line-title") }}
                    </Button>
                  </Flex>
                </template>
              </Repetable>
            </Card>

            <Card padding>
              <HtmlEditor
                id="modalities"
                name="modalities"
                :label="$t('pages.edit-quote.modalities')"
              />
            </Card>

            <Card padding>
              <HtmlEditor
                id="footer"
                name="footer"
                :label="$t('pages.edit-quote.footer')"
              />
            </Card>
          </div>
          <EditQuoteSummary
            :download-pdf="downloadPdf"
            :preview="preview"
            :quote="quote"
            :prices="prices"
            :has-changed="hasChanged"
            :has-error="hasError"
            :loading="loading"
            :send-mail="sendMail"
            :isAddAction="isAddAction"
          />
        </template>
      </Form>
    </PageContent>
  </Page>
  <QuoteSendMail
    @clickDownloadPDF="() => downloadPdf(quoteToSendMail as Quote)"
    @close="quoteToSendMail = null"
    :quote="quoteToSendMail"
  />
  <QuotePreview @close="quoteToPreview = null" :quote="quoteToPreview" />
  <EditClientSidebar @add="onAddClient" v-model:open="isAddClientOpen" />
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watch } from "vue";
import Form from "core/src/components/form/Form.vue";
import TextField from "core/src/components/form/TextField.vue";
import Button from "core/src/components/Button.vue";
import Page from "@/components/Page.vue";
import PageContent from "@/components/PageContent.vue";
import useQuoteStore from "../../stores/quotes";
import MagicAutocomplete from "core/src/components/magic/MagicAutocomplete.vue";
import useClientStore from "@/stores/clients";
import type { Quote } from "../../types";
import QuoteLineVue from "../../components/quotes/QuoteLine.vue";
import HtmlEditor from "core/src/components/form/HtmlEditor.vue";
import useVatStore from "@/stores/vat";
import Repetable from "core/src/components/form/repetable/Repetable.vue";
import EditClientSidebar from "@/components/clients/EditClientSidebar.vue";
import type Client from "@/types/client";
import { isEmpty } from "lodash";
import useEditPage from "@/components/editpage";
import type { SaleLine } from "@/modules/billing/types";
import useUserStore from "@/stores/user";
import Grid from "core/src/components/layouts/Grid.vue";
import Text from "core/src/components/Text.vue";
import Flex from "core/src/components/layouts/Flex.vue";
import useQuote from "../../components/quotes/quote";
import QuoteSendMail from "../../components/quotes/QuoteSendMail.vue";
import QuotePreview from "../../components/quotes/QuotePreview.vue";
import Card from "core/src/components/card/Card.vue";
import FloatingButton from "core/src/components/FloatingButton.vue";
import EditQuoteSummary from "../../components/quotes/EditQuoteSummary.vue";
import useUI from "core/src/composables/ui";

const clientsStore = useClientStore();
const quotesStore = useQuoteStore();
const vatsStore = useVatStore();
const userStore = useUserStore();

const auth = computed(() => userStore.auth);

const isAddClientOpen = ref(false);
const idClient = ref();
const clientOptions = ref();

const formValue = ref<Quote>();

const formHasChanged = ref<boolean>(false);

const title = computed(() => {
  if (isAddAction.value) {
    return t("new-quote");
  }
  return `${t("quote")} ${quote.value?.identifier || ""}`;
});

const vats = computed(() => vatsStore.getList);

onMounted(() => {
  vatsStore.fetchList();
});

function onAddClient(client: Client) {
  idClient.value = client.id;
  clientOptions.value = [client];
}

const prices = computed(() => {
  let totalPrice = 0;
  let totalPriceWithTaxes = 0;
  if (!formValue.value?.lines) return { totalPrice, totalPriceWithTaxes };
  for (const line of formValue.value.lines) {
    if (!line.qty || !line.unit_price) continue;
    const price = line.qty * line.unit_price;
    const vat = vats.value.find((v) => v.id == line.idVat);
    const vatPrice = price * (1 + (vat?.rate || 0) / 100);
    totalPriceWithTaxes += vatPrice;
    totalPrice += price;
  }
  return {
    totalPrice,
    totalPriceWithTaxes,
  };
});
watch(
  () => idClient.value,
  (val, oldVal) => {
    if (val != null && val != oldVal) {
      clientsStore.fetchById(val, { populate: "company" });
    }
  },
  { immediate: true }
);

const client = computed(() => {
  return clientsStore.getById(idClient.value);
});

const {
  downloadPdf,
  preview,
  quoteToPreview,
  sendMail,
  quoteToSendMail,
  edit,
} = useQuote({});

const {
  isAddAction,
  loading,
  loadingPage,
  model: quote,
  router,
  t,
  save,
} = useEditPage<Quote>({
  store: quotesStore,
  populate: ["client.company", "responsible.company", "lines.[vat, sublines]"],
  mapBeforeSave: (data) => {
    if (data.lines) {
      data.lines = data.lines
        .map((line: any) => {
          const newLine = { ...line };
          delete newLine.vat;
          return newLine;
        })
        .filter((line: any) => !isEmpty(line));
    }
    delete data.client;
    return data;
  },
  onAdd: (res) => {
    edit(res);
  },
});
useUI({
  pageChangeBlockedMessage: t("core.confirm_quite_without_save"),
  isPageChangeBlocked: () => {
    console.error({ formHasChanged: formHasChanged.value });
    return formHasChanged.value;
  },
});
</script>
