<template>
  <Page :title="title" :loading="loadingPage" back padding="large">
    <Form shortcuts :initial-value="quote" @submit="save" class="quote-details">
      <template #default="{ hasError, hasChanged }">
        <div class="quote-form-content">
          <div class="form-head">
            <Card>
              <Grid :gap="1">
                <TextField name="name" :label="$t('title')" />
                <div v-if="auth.company?.name">{{ auth.company.name }}</div>
                <div v-if="auth.company?.address">
                  {{ auth.company.address }}
                </div>
                <div v-if="auth.company?.city">
                  {{ auth.company.city }} {{ auth.company.zip_code }}
                </div>
                <div v-if="auth.company?.country">
                  {{ auth.company.country }}
                </div>
                <div v-if="auth.company?.phone">{{ auth.company.phone }}</div>
              </Grid>
            </Card>

            <Card>
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
            </Card>
          </div>
          <Card class="form-table">
            <Repetable name="lines" :label="$t('products')" orderable>
              <template #default="{ data }">
                <QuoteLineVue :line="(data as unknown as SaleLine)" />
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
          </Card>

          <Card>
            <HtmlEditor
              id="modalities"
              name="modalities"
              :label="$t('pages.edit-quote.modalities')"
            />
          </Card>

          <Card>
            <HtmlEditor
              id="footer"
              name="footer"
              :label="$t('pages.edit-quote.footer')"
            />
          </Card>
          <div class="actions">
            <Button
              :disabled="hasError || !hasChanged"
              :loading="loading"
              type="submit"
              v-tooltip="{
                text: $t('keyboardshortcuts.ctrl+s'),
                placement: 'bottom',
              }"
            >
              {{ $t("save") }}
            </Button>
          </div>
        </div>
        <Card class="quote-summary"> TETS </Card>
      </template>
    </Form>
  </Page>
  <EditClientSidebar @add="onAddClient" v-model:open="isAddClientOpen" />
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import Form from "core/src/components/form/Form.vue";
import TextField from "core/src/components/form/TextField.vue";
import Button from "core/src/components/Button.vue";
import Page from "@/components/Page.vue";
import useQuoteStore from "@/stores/quotes";
import MagicAutocomplete from "core/src/components/magic/MagicAutocomplete.vue";
import useClientStore from "@/stores/clients";
import type { Quote } from "@/types/quote";
import QuoteLineVue from "@/components/quotes/QuoteLine.vue";
import HtmlEditor from "core/src/components/HtmlEditor.vue";
import useVatStore from "@/stores/vat";
import Repetable from "core/src/components/form/repetable/Repetable.vue";
import EditClientSidebar from "@/components/clients/EditClientSidebar.vue";
import type Client from "@/types/client";
import Card from "core/src/components/Card.vue";
import { isEmpty } from "lodash";
import useEditPage from "@/components/editpage";
import type { SaleLine } from "@/types/sale";
import useUserStore from "@/stores/user";
import Grid from "core/src/components/layouts/Grid.vue";

const clientsStore = useClientStore();
const quotesStore = useQuoteStore();
const vatsStore = useVatStore();
const userStore = useUserStore();

const auth = computed(() => userStore.auth);

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
    router.push("/quotes/" + res.id);
    quote.value = res;
  },
});
</script>

<style scoped lang="scss">
.quote-details {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: spacing(2);
  .quote-form-content {
    grid-column: span 2;
    @include grid(1, 0, 2);
    .actions {
      display: flex;
      gap: spacing(1);
      margin-top: spacing(1);
    }
    .form-head {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: spacing(2);
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
  .quote-summary {
    height: fit-content;
    position: sticky;
    top: 0;
  }
}
</style>
