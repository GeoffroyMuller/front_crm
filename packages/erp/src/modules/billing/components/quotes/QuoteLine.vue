<template>
  <div v-if="line.type === 'comment'">
    <TextField
      multiline
      :label="$t('pages.edit-quote.comment')"
      name="description"
    />
  </div>
  <div v-if="line.type === 'title'">
    <TextField :label="$t('pages.edit-quote.title')" name="description" />
  </div>
  <div v-if="line.type === 'product'" class="line-product-container">
    <div class="line-product">
      <MagicAutocomplete
        class="input"
        :get-option-value="(opt) => opt.id"
        :label="$t('pages.edit-quote.product')"
        :store="productsStore"
        :get-option-label="(opt) => opt?.name"
        @update:selected="handleProductChange"
        option-key="id"
        name="idProduct"
      />
      <TextField
        class="input"
        type="number"
        v-model="internalLine.qty"
        :label="$t('pages.edit-quote.qty')"
        :step="1"
        name="qty"
      />
      <TextField
        class="input"
        type="number"
        :step="0.01"
        v-model="internalLine.unit_price"
        :label="$t('pages.edit-quote.unit_price')"
        name="unit_price"
      />
      <Select
        class="input"
        :options="vats"
        :get-option-label="(opt) => (opt?.rate != null ? `${opt?.rate}%` : '')"
        :get-option-value="(opt) => opt.id"
        v-model="internalLine.idVat"
        :label="$t('pages.edit-quote.vat')"
        name="idVat"
      />
      <div class="totals">
        <Text typo="subtitle">
          {{ $t("pages.edit-quote.total-global") }}
        </Text>
        <Text>{{ $t("pages.edit-quote.without-taxes") }}</Text>
        <Text>
          {{
            typeof totalWithoutTaxes === "string"
              ? totalWithoutTaxes
              : $utils.formatPrice(totalWithoutTaxes)
          }}
        </Text>
        <Text>{{ $t("pages.edit-quote.with-taxes") }}</Text>
        <Text>
          {{
            typeof totalWithTaxes === "string"
              ? totalWithTaxes
              : $utils.formatPrice(totalWithTaxes)
          }}
        </Text>
      </div>
    </div>
    <HtmlEditor
      class="description"
      :label="$t('pages.edit-quote.description')"
      v-model="internalLine.description"
      name="description"
    />
    <div
      v-if="
        !$_.isNil(internalProduct) &&
        productsStore.isPhysicalStock(internalProduct)
      "
      class="products-real"
    >
      <div v-if="nbProductReal" class="typo-text">
        {{ $t("pages.sales.count-sentence", { count: nbProductReal }) }}
      </div>
      <div v-else class="typo-text">
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
import HtmlEditor from "core/src/components/HtmlEditor.vue";
import useVatStore from "@/stores/vat";
import useProductStore from "@/modules/products/stores/products";
import type { Vat } from "@/types/vat";
import MagicAutocomplete from "core/src/components/magic/MagicAutocomplete.vue";
import type { Product, ProductReal } from "@/types/product";
import useProductsRealStore from "@/stores/products_real";
import QuoteSublineForm from "./QuoteSublineForm.vue";
import Sidebar from "core/src/components/Sidebar.vue";
import Button from "core/src/components/Button.vue";
import Alert from "core/src/components/Alert.vue";
import type { SaleLine } from "@/modules/billing/types";

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

<style lang="scss" scoped>
$productLineBreakpoints: (
  xs: 0,
  sm: 576px,
  md: 768px,
  lg: 992px,
  lg2: 1150px,
  xl: 1270px,
  xl2: 1400px,
);
.line-product {
  display: grid;
  gap: spacing(1);
  grid-template-columns: 1fr 90px 120px 90px min-content;
  justify-content: center;
  align-items: end;
  .totals {
    display: grid;
    grid-template-columns: min-content 1fr;
    gap: spacing(1);
    justify-self: end;
    padding-left: spacing(1);
    & > :first-child {
      grid-column: 1 / -1;
    }
  }
  @include media-down(xl2, $productLineBreakpoints) {
    > *:first-child {
      grid-column: 1 / -1;
    }
    gap: spacing(1) spacing(0.5);
    grid-template-columns: 90px 1fr 90px min-content;
  }
  @include media-down(xl, $productLineBreakpoints) {
    .totals {
      grid-column: 1 / -1;
      display: flex;
      padding-left: 0;
      justify-self: start;
      align-self: start;
    }
  }
  @include media-down(lg2, $productLineBreakpoints) {
    > *:first-child {
      grid-column: initial;
    }
    grid-template-columns: 1fr 90px;
  }
}
@include media-up(md) {
}
@include media-down(md) {
  .line-product {
    display: grid;
    gap: spacing(1.5);
  }
}
.line-product-container {
  display: grid;
  gap: spacing(1.5);
}
</style>
