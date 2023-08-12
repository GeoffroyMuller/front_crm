<template>
  <TextField
    v-if="line.type === 'comment'"
    multiline
    :label="$t('pages.edit-quote.comment')"
    name="description"
  />

  <TextField
    v-else-if="line.type === 'title'"
    :label="$t('pages.edit-quote.title')"
    name="description"
  />

  <div v-else-if="line.type === 'product'" class="line-product-container">
    <div class="2xl:flex items-end gap-2">
      <div
        class="grid flex-1 items-end gap-2 max-2xl:grid-cols-[1fr_90px] 2xl:grid-cols-[1fr_90px_120px_90px]"
      >
        <MagicAutocomplete
          :get-option-value="(opt) => opt.id"
          :label="$t('pages.edit-quote.product')"
          :store="productsStore"
          :get-option-label="(opt) => opt?.name"
          @update:selected="handleProductChange"
          option-key="id"
          name="idProduct"
        />
        <TextField
          type="number"
          v-model="internalLine.qty"
          :label="$t('pages.edit-quote.qty')"
          :step="1"
          name="qty"
        />
        <TextField
          type="number"
          :step="0.01"
          v-model="internalLine.unit_price"
          :label="$t('pages.edit-quote.unit_price')"
          name="unit_price"
        />
        <Select
          :options="vats"
          :get-option-label="
            (opt) => (opt?.rate != null ? `${opt?.rate}%` : '')
          "
          :get-option-value="(opt) => opt.id"
          v-model="internalLine.idVat"
          :label="$t('pages.edit-quote.vat')"
          name="idVat"
        />
      </div>
      <div
        class="max-2xl:flex 2xl:pl-2 2xl:w-[100px] max-2xl:justify-end max-2xl:items-center max-2xl:py-4 grid grid-cols-2 gap-2 2xl:gap-1 self-center"
      >
        <Text typo="title7" class="col-span-2 2xl:mb-2 max-2xl:mr-4">
          {{ $t("pages.edit-quote.total-global") }}
        </Text>
        <Text typo="title7">{{ $t("pages.edit-quote.without-taxes") }}</Text>
        <Text typo="title3">
          {{
            typeof totalWithoutTaxes === "string"
              ? totalWithoutTaxes
              : $utils.formatPrice(totalWithoutTaxes)
          }}
        </Text>
        <Text typo="title7">{{ $t("pages.edit-quote.with-taxes") }}</Text>
        <Text typo="title3">
          {{
            typeof totalWithTaxes === "string"
              ? totalWithTaxes
              : $utils.formatPrice(totalWithTaxes)
          }}
        </Text>
      </div>
    </div>
    <HtmlEditor
      class="mt-2"
      :label="$t('pages.edit-quote.description')"
      v-model="internalLine.description"
      name="description"
    />
    <div
      v-if="
        !$_.isNil(internalProduct) &&
        productsStore.isPhysicalStock(internalProduct)
      "
      class="grid gap-2 mt-2"
    >
      <div v-if="nbProductReal" class="typo-text1">
        {{ $t("pages.sales.count-sentence", { count: nbProductReal }) }}
      </div>
      <div v-else class="typo-text1">
        {{ $t("pages.sales.add-product-real-sentence") }}
      </div>
      <Button
        color="primary"
        icon="edit"
        variant="text"
        @click.stop="openSublineForm"
      >
        {{ $t("pages.sales.edit-list-products-real") }}
      </Button>
      <Sidebar v-model:open="isSidebarOpen" displayCloseBtn padding>
        <QuoteSublineForm
          :product="internalProduct"
          v-model:count="nbProductReal"
        ></QuoteSublineForm>
      </Sidebar>
    </div>

    <div
      class="mt-2"
      v-if="
        !$_.isNil(internalProduct) &&
        productsStore.isPhysicalStock(internalProduct) &&
        nbProductReal != internalLine.qty
      "
    >
      <Alert color="warning">{{
        $t("pages.sales.warning-sentence-qty")
      }}</Alert>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, toRef } from "vue";
import TextField from "core/src/components/form/TextField.vue";
import Select from "core/src/components/form/Select.vue";
import HtmlEditor from "core/src/components/form/HtmlEditor.vue";
import useVatStore from "@/stores/vat";
import useProductStore from "@/modules/products/stores/products";
import type { Vat } from "@/types/vat";
import MagicAutocomplete from "core/src/components/magic/MagicAutocomplete.vue";
import type { Product } from "@/types/product";
import QuoteSublineForm from "./QuoteSublineForm.vue";
import Sidebar from "core/src/components/Sidebar.vue";
import Button from "core/src/components/Button.vue";
import Alert from "core/src/components/Alert.vue";
import type { SaleLine } from "@/modules/billing/types";
import Text from "core/src/components/Text.vue";

interface QuoteLineProps {
  line: SaleLine;
}

const vatsStore = useVatStore();
const productsStore = useProductStore();

const vats = computed(() => vatsStore.getList);

const totalWithoutTaxes = computed(() => {
  if (!internalLine.value.unit_price || !internalLine.value.qty) {
    return "-";
  }
  return internalLine.value.unit_price * internalLine.value.qty;
});

const totalWithTaxes = computed(() => {
  const vatRate = vats.value.find(
    (vat: Vat) => vat.id == internalLine.value.idVat
  )?.rate;
  if (totalWithoutTaxes.value === "-" || vatRate == null) {
    return "-";
  }
  const twt = totalWithoutTaxes.value;
  return twt + twt * (vatRate / 100);
});

const props = withDefaults(defineProps<QuoteLineProps>(), {});

const internalLine = ref(props.line);
const internalProduct = ref<Product | null>(null);
const isSidebarOpen = ref<boolean>(false);
const nbProductReal = ref<number>();

function openSublineForm() {
  isSidebarOpen.value = true;
}

function handleProductChange(product: Product) {
  if (product != null) {
    internalProduct.value = product;
    internalLine.value.description =
      internalLine.value.description || (product.description as string);
    internalLine.value.unit_price =
      internalLine.value.unit_price || (product.price as number);
    internalLine.value.idVat =
      internalLine.value.idVat || (product.idVat as number);
  }
}
</script>
