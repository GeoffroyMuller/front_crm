<template>
  <Page :title="title" :loading="loading" back>
    <Card>
      <Form
        :model-value="invoice"
        @submit="handleSubmit"
        class="invoice-form-content"
      >
        <template #default="{ hasError }">
          <div class="form-head">
            <TextField name="name" :label="$t('title')" />

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
                <InvoiceLineVue :line="(data as unknown as InvoiceLine)" />
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
            <Button :disabled="hasError" type="submit">{{ $t("save") }}</Button>
          </div>
        </template>
      </Form>
      <EditClientSidebar @add="onAddClient" v-model:open="isAddClientOpen" />
    </Card>
  </Page>
</template>
<script setup lang="ts">
import Page from "@/components/Page.vue";
import useUI from "@/core/helpers/vue/composables/ui";
import useClientStore from "@/stores/clients";
import useInvoicesStore from "@/stores/invoices";
import useVatStore from "@/stores/vat";
import type Client from "@/types/client";
import type Invoice from "@/types/invoice";
import { ref, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter, useRoute } from "vue-router";
import { isEmpty } from "lodash";
import TextField from "@/core/components/form/TextField.vue";
import MagicAutocomplete from "@/core/components/magic/MagicAutocomplete.vue";
import Form from "@/core/components/form/Form.vue";
import Repetable from "@/core/components/form/repetable/Repetable.vue";
import Button from "@/core/components/Button.vue";
import EditClientSidebar from "@/components/clients/EditClientSidebar.vue";
import HtmlEditor from "@/core/components/HtmlEditor.vue";
import InvoiceLineVue from "@/components/invoices/InvoiceLine.vue";
import type { InvoiceLine } from "@/types/invoice";
import Card from "@/core/components/Card.vue";

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

const invoice = ref<Invoice | null>(invoiceStore.getById(id as string));

const title = computed(() => {
  if (isAddAction.value) {
    return t("pages.edit-invoice.new-invoice");
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
      router.push("/invoices/" + res.id);
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
