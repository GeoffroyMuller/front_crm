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
          :get-option-value="(opt) => opt.id"
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
          <CheckoutProductRealLine :product="product"></CheckoutProductRealLine>
        </template>
      </Repetable>
    </Grid>
  </div>
</template>
<script setup lang="ts">
import Repetable from "core/src/components/form/repetable/Repetable.vue";
import TextField from "core/src/components/form/TextField.vue";
import Grid from "core/src/components/layouts/Grid.vue";
import MagicAutocomplete from "core/src/components/magic/MagicAutocomplete.vue";
import useProductsStore from "@/stores/products";
import type { Product } from "@/types/product";
import { isNil } from "lodash";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import CheckoutProductRealLine from "./CheckoutProductRealLine.vue";

const { t } = useI18n();
const productStore = useProductsStore();

interface CheckoutProductLineProps {
  line: any;
}

const props = withDefaults(defineProps<CheckoutProductLineProps>(), {});
const product = ref<Product | null>();

const lineProductMerged = computed((): any => {
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
