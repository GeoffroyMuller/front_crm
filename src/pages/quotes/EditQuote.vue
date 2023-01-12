<template>
  <Page :title="title" :loading="loading">
    <Card>
      <Form
        :model-value="quote"
        @submit="handleSubmit"
        class="quote-form-content"
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
              :addText="$t(`pages.edit-quote.add-customer`)"
              can-add
              @add="isAddClientOpen = true"
              v-model:options="clientOptions"
              v-model="idClient"
            />
          </div>
          <div class="form-table">
            <Repetable name="lines" :label="$t('products')">
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
            <Button :disabled="hasError" type="submit">{{ $t("save") }}</Button>
          </div>
        </template>
      </Form>
    </Card>
  </Page>
  <EditClientSidebar @add="onAddClient" v-model:open="isAddClientOpen" />
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watch } from "vue";
import Form from "@/core/components/form/Form.vue";
import TextField from "@/core/components/form/TextField.vue";
import Button from "@/core/components/Button.vue";
import Page from "@/components/Page.vue";
import { useRoute, useRouter } from "vue-router";
import useQuoteStore from "@/stores/quotes";
import { useI18n } from "vue-i18n";
import useUI from "@/core/helpers/vue/composables/ui";
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

const clientsStore = useClientStore();
const quotesStore = useQuoteStore();
const vatsStore = useVatStore();

const router = useRouter();
const { id } = useRoute().params;
const { t } = useI18n();
const { toast } = useUI();

const isAddClientOpen = ref(false);
const idClient = ref();
const clientOptions = ref();

const isAddAction = computed(
  () => !quote.value && (!id || Number.isNaN(Number.parseInt(id as string)))
);
const loading = computed(() => {
  return isAddAction.value ? false : !quote.value;
});

const quote = ref<Quote | null>(null);

const title = computed(() => {
  if (isAddAction.value) {
    return t("new-quote");
  }
  return `${t("quote")} ${quote.value?.identifier || ""}`;
});

onMounted(() => {
  vatsStore.fetchList();
  if (!isAddAction.value) {
    quotesStore
      .fetchById(id, {
        populate: ["client.company", "responsible.company", "lines.vat"],
      })
      .then((res) => {
        quote.value = res;
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

async function handleSubmit(data: any) {
  if (data.lines) {
    data.lines = data.lines.map((line) => {
      const newLine = { ...line };
      delete newLine.vat;
      return newLine;
    });
  }
  delete data.client;
  try {
    if (!isAddAction.value) {
      await quotesStore.update((quote.value as Quote).id, data);
    } else {
      const res = await quotesStore.create(data);
      router.push("/quotes/" + res.id);
      quote.value = res;
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

<style lang="scss">
.quote-form-content {
  @include grid(1, 0, 2);
  .actions {
    display: flex;
    gap: spacing(1);
    margin-top: spacing(1);
  }
  .form-head {
    @include grid(2, 0, 2);
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
.input-and-button-container {
  display: flex;
  justify-content: flex-start;
  gap: 0;
  align-items: center;
}
</style>
