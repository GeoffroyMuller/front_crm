<template>
  <Page :title="title" :loading="loadingPage" back>
    <Card>
      <Form
        shortcuts
        :initial-value="invoice"
        @submit="save"
        class="invoice-form-content"
      >
        <template #default="{ hasError, hasChanged }">
          <div class="form-head">
            <TextField name="name" :label="$t('title')" />

            <MagicAutocomplete
              :label="$t('customer')"
              :store="clientsStore"
              :get-option-value="(opt) => opt.id"
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
              :addText="$t(`pages.edit-invoice.add-customer`)"
              can-add
              @add="isAddClientOpen = true"
              v-model:options="clientOptions"
              v-model="idClient"
            />
          </div>
          <div class="form-table">
            <Repetable name="lines" :label="$t('products')" orderable>
              <template #default="{ data }">
                <InvoiceLineVue :line="(data as unknown as SaleLine)" />
              </template>
              <template #actions="{ addSection }">
                <Button
                  type="button"
                  variant="text"
                  @click="addSection({ type: 'product' })"
                >
                  {{ $t("pages.edit-invoice.add-line-product") }}
                </Button>
                <Button
                  type="button"
                  variant="text"
                  @click="addSection({ type: 'comment' })"
                >
                  {{ $t("pages.edit-invoice.add-line-comment") }}
                </Button>
                <Button
                  type="button"
                  variant="text"
                  @click="addSection({ type: 'title' })"
                >
                  {{ $t("pages.edit-invoice.add-line-title") }}
                </Button>
              </template>
            </Repetable>
          </div>
          <HtmlEditor
            id="modalities"
            name="modalities"
            :label="$t('pages.edit-invoice.modalities')"
          />

          <HtmlEditor
            id="footer"
            name="footer"
            :label="$t('pages.edit-invoice.footer')"
          />
          <div class="actions">
            <Button
              :disabled="hasError || !hasChanged"
              :loading="loading"
              v-tooltip="{
                text: $t('keyboardshortcuts.ctrl+s'),
                placement: 'bottom',
              }"
              type="submit"
            >
              {{ $t("save") }}
            </Button>
          </div>
        </template>
      </Form>
      <EditClientSidebar @add="onAddClient" v-model:open="isAddClientOpen" />
    </Card>
  </Page>
</template>
<script setup lang="ts">
import Page from "@/components/Page.vue";
import useClientStore from "@/stores/clients";
import useInvoicesStore from "@/stores/invoices";
import useVatStore from "@/stores/vat";
import type Client from "@/types/client";
import type Invoice from "@/types/invoice";
import { ref, computed, onMounted } from "vue";
import { isEmpty } from "lodash";
import TextField from "core/src/components/form/TextField.vue";
import MagicAutocomplete from "core/src/components/magic/MagicAutocomplete.vue";
import Form from "core/src/components/form/Form.vue";
import Repetable from "core/src/components/form/repetable/Repetable.vue";
import Button from "core/src/components/Button.vue";
import EditClientSidebar from "@/components/clients/EditClientSidebar.vue";
import HtmlEditor from "core/src/components/HtmlEditor.vue";
import InvoiceLineVue from "@/components/invoices/InvoiceLine.vue";
import Card from "core/src/components/Card.vue";
import useEditPage from "@/components/editpage";
import type { SaleLine } from "@/types/sale";

const invoiceStore = useInvoicesStore();
const clientsStore = useClientStore();
const vatsStore = useVatStore();

onMounted(() => {
  if (isAddAction.value && invoiceStore.invoiceToCreate != null) {
    invoice.value = invoiceStore.invoiceToCreate;
    invoiceStore.deleteInvoiceToCreate();
  }
});

const {
  model: invoice,
  loadingPage,
  loading,
  router,
  isAddAction,
  t,
  save,
} = useEditPage<Invoice>({
  store: invoiceStore,
  populate: [
    "client.company",
    "responsible.company",
    "lines.[vat, sublines]",
    "total",
  ],
  onAdd: (res) => {
    router.push("/invoices/" + res.id);
    invoice.value = res;
  },
  mapBeforeSave: (data) => {
    if (data.lines) {
      data.lines = data.lines
        .map((line: SaleLine) => {
          const newLine = { ...line };
          // @ts-ignore
          delete newLine.vat;
          return newLine;
        })
        .filter((line: SaleLine) => !isEmpty(line));
    }
    delete data.client;
    return data;
  },
});

const isAddClientOpen = ref(false);
const idClient = ref();
const clientOptions = ref();

const title = computed(() => {
  if (isAddAction.value) {
    return t("pages.edit-invoice.new-invoice");
  }
  return `${t("invoice")} ${invoice.value?.identifier || ""}`;
});

onMounted(() => {
  vatsStore.fetchList();
});

function onAddClient(client: Client) {
  idClient.value = client.id;
  clientOptions.value = [client];
}
</script>

<style scoped lang="scss">
.invoice-form-content {
  @include grid(1, 0, 2);
  .actions {
    display: flex;
    gap: spacing(1);
    margin-top: spacing(1);
  }
  .form-head {
    @include grid(2, 0, 1);
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
