<template>
  <Page :title="title" :loading="loading" back>
    <Card>
      <Form
        shortcuts
        :model-value="quote"
        @submit="save"
        class="quote-form-content"
      >
        <template #default="{ hasError }">
          <div class="form-head">
            <TextField name="name" :label="$t('title')" />

            <QuoteStatusSelect />

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
              optionKey="id"
              name="idClient"
              :addText="$t(`pages.edit-quote.add-customer`)"
              can-add
              @add="isAddClientOpen = true"
              v-model:options="clientOptions"
              v-model="idClient"
            />
          </div>
          <div class="form-table">
            <Repetable name="lines" :label="$t('products')" orderable>
              <template #default="{ data }">
                <QuoteLineVue :line="(data as unknown as QuoteLine)" />
              </template>
              <template #actions="{ addSection }">
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
              </template>
            </Repetable>
          </div>
          <HtmlEditor
            id="modalities"
            name="modalities"
            :label="$t('pages.edit-quote.modalities')"
          />

          <HtmlEditor
            id="footer"
            name="footer"
            :label="$t('pages.edit-quote.footer')"
          />
          <div class="actions">
            <Button
              :disabled="hasError"
              type="submit"
              v-tooltip="{
                text: $t('keyboardshortcuts.ctrl+s'),
                placement: 'bottom',
              }"
            >
              {{ $t("save") }}
            </Button>
          </div>
        </template>
      </Form>
    </Card>
  </Page>
  <EditClientSidebar @add="onAddClient" v-model:open="isAddClientOpen" />
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import Form from "@/core/components/form/Form.vue";
import TextField from "@/core/components/form/TextField.vue";
import Button from "@/core/components/Button.vue";
import Page from "@/components/Page.vue";
import useQuoteStore from "@/stores/quotes";
import MagicAutocomplete from "@/core/components/magic/MagicAutocomplete.vue";
import useClientStore from "@/stores/clients";
import type { Quote, QuoteLine } from "@/types/quote";
import QuoteLineVue from "@/components/quotes/QuoteLine.vue";
import HtmlEditor from "@/core/components/HtmlEditor.vue";
import useVatStore from "@/stores/vat";
import Repetable from "@/core/components/form/repetable/Repetable.vue";
import EditClientSidebar from "@/components/clients/EditClientSidebar.vue";
import type Client from "@/types/client";
import Card from "@/core/components/Card.vue";
import { isEmpty } from "lodash";
import QuoteStatusSelect from "@/components/quotes/QuoteStatusSelect.vue";
import useEditPage from "@/components/editpage";

const clientsStore = useClientStore();
const quotesStore = useQuoteStore();
const vatsStore = useVatStore();

const isAddClientOpen = ref(false);
const idClient = ref();
const clientOptions = ref();

const title = computed(() => {
  if (isAddAction.value) {
    return t("new-quote");
  }
  return `${t("quote")} ${quote.value?.identifier || ""}`;
});

onMounted(() => {
  vatsStore.fetchList();
});

function onAddClient(client: Client) {
  idClient.value = client.id;
  clientOptions.value = [client];
}

const {
  isAddAction,
  loading,
  model: quote,
  router,
  t,
  save,
} = useEditPage<Quote>({
  store: quotesStore,
  populate: ["client.company", "responsible.company", "lines.vat"],
  mapBeforeSave: (data) => {
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
    return data;
  },
  onAdd: (res) => {
    router.push("/quotes/" + res.id);
    quote.value = res;
  },
});
</script>

<style scoped lang="scss">
.quote-form-content {
  @include grid(1, 0, 2);
  .actions {
    display: flex;
    gap: spacing(1);
    margin-top: spacing(1);
  }
  .form-head {
    @include grid(3, 0, 2);
  }
  .form-table {
    .actions {
      display: flex;
      justify-content: flex-end;
      width: 100%;
      gap: spacing(1);
    }
  }
}
</style>
