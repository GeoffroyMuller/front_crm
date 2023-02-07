<template>
  <div>
    <Grid :gap="2" :columns="2">
      <MagicAutocomplete
        name="idProductReal"
        :label="$t('reference')"
        :getOptionLabel="displayProductRealAutocomplete"
        @update:selected="handleProductRealChange"
        option-key="id"
        :get-filters="
          (str) => ({
            $contains: {
              reference: str,
              idProduct: product.id,
            },
          })
        "
        :store="productRealStore"
      />
      <Grid :gap="2" :columns="2">
        <TextField
          :rules="$yup.string().required()"
          :model-value="lineProductRealMerged.price"
          type="number"
          :step="0.01"
          name="price"
          :label="$t('unit-price')"
        />
      </Grid>
    </Grid>
  </div>
</template>
<script setup lang="ts">
import TextField from "@/core/components/form/TextField.vue";
import Grid from "@/core/components/layouts/Grid.vue";
import MagicAutocomplete from "@/core/components/magic/MagicAutocomplete.vue";
import useProductsRealStore from "@/stores/products_real";
import type { Product, ProductReal } from "@/types/product";
import type { SaleFormProductRealLine } from "@/types/sale";
import { isNil } from "lodash";
import { computed, ref } from "vue";

const productRealStore = useProductsRealStore();

interface CheckoutProductRealLineProps {
  line?: any;
  product: Product;
}

const props = withDefaults(defineProps<CheckoutProductRealLineProps>(), {});
const productReal = ref<ProductReal | null>();

function displayProductRealAutocomplete(productReal: ProductReal) {
  return `${productReal.reference}`;
}
function handleProductRealChange(_productReal: ProductReal) {
  productReal.value = _productReal;
}

const lineProductRealMerged = computed((): SaleFormProductRealLine => {
  return {
    price: !isNil(props.line?.price) ? props.line?.price : props.product.price,
  };
});
</script>
<style lang="scss"></style>
