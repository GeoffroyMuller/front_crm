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
    <MagicAutocomplete
      class="input"
      :label="$t('pages.edit-quote.product')"
      :store="productsStore"
      :get-option-label="(opt) => opt?.name"
      @update:selected="handleProductChange"
      option-key="id"
      name="idProduct"
    />
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
      <Button color="success" icon="add" @click.stop="openSublineForm">
        {{ $t("edit-products-real") }}
      </Button>

      <Sidebar v-model:open="isSidebarOpen" displayCloseBtn>
        <QuoteSublineForm
          class="quote-subline-form"
          :product="internalProduct"
        ></QuoteSublineForm>
      </Sidebar>
    </div>

    <div class="line-product">
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

      <div class="total">
        <div class="inner">
          <div>
            <div class="label">
              {{ $t("pages.edit-quote.total-without-taxes") }}
            </div>
            <div class="value">{{ totalWithoutTaxes }} €</div>
          </div>
          <div>
            <div class="label">{{ $t("pages.edit-quote.total") }}</div>
            <div class="value">{{ totalWithTaxes }} €</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { QuoteLine } from "@/types/quote";
import { computed, ref, toRef } from "vue";
import TextField from "@/core/components/form/TextField.vue";
import Select from "@/core/components/form/Select.vue";
import HtmlEditor from "@/core/components/HtmlEditor.vue";
import useVatStore from "@/stores/vat";
import useProductStore from "@/stores/products";
import type { Vat } from "@/types/vat";
import MagicAutocomplete from "@/core/components/magic/MagicAutocomplete.vue";
import type { Product, ProductReal } from "@/types/product";
import type { InvoiceLine } from "@/types/invoice";
import useProductsRealStore from "@/stores/products_real";
import QuoteSublineForm from "./QuoteSublineForm.vue";
import Sidebar from "@/core/components/Sidebar.vue";
import Button from "@/core/components/Button.vue";

interface QuoteLineProps {
  line: QuoteLine | InvoiceLine;
}

const vatsStore = useVatStore();
const productsStore = useProductStore();

const vats = computed(() => vatsStore.getList);

const totalWithoutTaxes = computed(() => {
  if (!internalLine.value.unit_price || !internalLine.value.qty) {
    return "-";
  }
  return (internalLine.value.unit_price * internalLine.value.qty).toFixed(2);
});

const totalWithTaxes = computed(() => {
  const vatRate = vats.value.find(
    (vat: Vat) => vat.id == internalLine.value.idVat
  )?.rate;
  if (totalWithoutTaxes.value === "-" || vatRate == null) {
    return "-";
  }
  const twt = Number.parseFloat(totalWithoutTaxes.value);
  return (twt + twt * (vatRate / 100)).toFixed(2);
});

const props = withDefaults(defineProps<QuoteLineProps>(), {});

const internalLine = ref(props.line);
const internalProduct = ref<Product | null>(null);
const isSidebarOpen = ref<boolean>(false);

function openSublineForm() {
  console.error(isSidebarOpen.value);
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
.line-product {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: spacing(1);
  .input {
    width: fit-content;
  }

  .total {
    display: flex;
    justify-content: center;
    .inner {
      @include grid(1, 0, 1.2);
      > div {
        width: max-content;
        @include grid(1, 0, 0.75);
        .label {
          font-weight: bold;
          @include typo(subtitle);
        }
        .value {
          @include typo(text);
        }
      }
    }
  }
}
@include media-up(md) {
}
@include media-down(md) {
  .line-product {
    display: grid;
    gap: spacing(1.5);
    .total {
      justify-content: start;
    }
  }
}
.line-product-container {
  display: grid;
  gap: spacing(1.5);
}
.quote-subline-form {
  padding: spacing(2);
}
</style>
