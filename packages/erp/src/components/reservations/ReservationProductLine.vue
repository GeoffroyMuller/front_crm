<template>
  <div class="reservation-product-line">
    <Grid :gap="2" :columns="1">
      <Grid :gap="2" :columns="3">
        <MagicAutocomplete
          class="reservation-product"
          name="product"
          :getOptionValue="(opt) => opt"
          :label="$t('product')"
          :getOptionLabel="displayProductAutocomplete"
          @update:selected="handleProductChange"
          :get-filters="
            (str) => ({ $or: { $contains: { name: str, price: str } } })
          "
          :store="productStore"
        />
        <TextField
          class="input"
          :model-value="1"
          type="number"
          :label="$t('pages.edit-quote.qty')"
          :step="1"
          :min="1"
          name="qty"
        />
      </Grid>
    </Grid>
  </div>
</template>
<script setup lang="ts">
import Button from "core/src/components/Button.vue";
import Repetable from "core/src/components/form/repetable/Repetable.vue";
import Grid from "core/src/components/layouts/Grid.vue";
import MagicAutocomplete from "core/src/components/magic/MagicAutocomplete.vue";
import useProductsStore from "@/stores/products";
import type { Product } from "@/types/product";
import type { SaleLine } from "@/types/sale";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import ReservationProductRealLine from "./ReservationProductRealLine.vue";
import TextField from "core/src/components/form/TextField.vue";
import type { multiply } from "lodash";

const { t } = useI18n();
const productStore = useProductsStore();

interface ReservationProductLineProps {
  line?: SaleLine;
}
const props = withDefaults(defineProps<ReservationProductLineProps>(), {});
const product = ref<Product | null>();

function displayProductAutocomplete(_product: Product): string {
  return `${_product.name} ${"| " + t("price") + " : " + _product.price} ${
    productStore.isNumeraryStock(_product)
      ? "| " + t("stock") + " : " + _product.stock
      : ""
  }`;
}

function handleProductChange(_product: Product) {
  product.value = _product;
}
</script>
<style lang="scss">
.reservation-product-line {
  .reservation-product {
    grid-column: 1 / 3;
  }
}
</style>
