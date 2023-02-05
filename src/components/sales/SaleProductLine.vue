<template>
  <div>
    <Grid :gap="2" :columns="1">
      <Grid :gap="2" :columns="2">
        <MagicAutocomplete
          name="product"
          :getOptionValue="(opt) => opt"
          :label="$t('product')"
          :getOptionLabel="displayProductAutocomplete"
          @update:selected="handleProductChange"
          option-key="id"
          :get-filters="
            (str) => ({ $or: { $contains: { name: str, price: str } } })
          "
          :store="productStore"
        />
        <template v-if="product">
          <Grid :gap="2" :columns="2">
            <TextField
              v-if="!productStore.isPhysicalStock(product)"
              :rules="$yup.string().required()"
              :model-value="lineProductMerged?.price"
              type="number"
              :step="0.01"
              name="price"
              :label="$t('unit-price')"
            />
            <TextField
              v-if="!productStore.isPhysicalStock(product)"
              :rules="$yup.string().required()"
              :model-value="lineProductMerged?.quantity"
              :min="1"
              type="number"
              :step="1"
              name="quantity"
              :label="$t('quantity')"
            />
          </Grid>
        </template>
      </Grid>
      <Repetable
        v-if="productStore.isPhysicalStock(product) && product"
        name="form_product_real_lines"
      >
        <template #default>
          <SaleProductRealLine :product="product"></SaleProductRealLine>
        </template>
      </Repetable>
    </Grid>
  </div>
</template>
<script setup lang="ts">
import Repetable from "@/core/components/form/repetable/Repetable.vue";
import TextField from "@/core/components/form/TextField.vue";
import Grid from "@/core/components/layouts/Grid.vue";
import MagicAutocomplete from "@/core/components/magic/MagicAutocomplete.vue";
import useProductsStore from "@/stores/products";
import type { Product } from "@/types/product";
import type { SaleFormProductLine } from "@/types/sale";
import { isNil } from "lodash";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import SaleProductRealLine from "./SaleProductRealLine.vue";

const { t } = useI18n();
const productStore = useProductsStore();

interface SaleProductLineProps {
  line: SaleFormProductLine;
}

const props = withDefaults(defineProps<SaleProductLineProps>(), {});
const product = ref<Product | null>();

const lineProductMerged = computed((): SaleFormProductLine => {
  return {
    price: !isNil(props.line.price) ? props.line.price : product.value?.price,
    quantity: !isNil(props.line.quantity)
      ? props.line.quantity
      : !isNil(product.value)
      ? 1
      : undefined,
  };
});

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
<style lang="scss"></style>
