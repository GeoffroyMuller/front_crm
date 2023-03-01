<template>
  <div>
    <Grid :gap="2" :columns="1">
      <MagicAutocomplete
        name="idProductReal"
        :get-option-value="(opt) => opt.id"
        optionKey="id"
        :label="$t('reference')"
        :getOptionLabel="displayProductRealAutocomplete"
        @update:selected="handleProductRealChange"
        :get-filters="
          (str) => ({
            $contains: {
              reference: str,
              idProduct: product?.id,
            },
          })
        "
        :store="productRealStore"
      />
    </Grid>
  </div>
</template>
<script setup lang="ts">
import Grid from "core/src/components/layouts/Grid.vue";
import MagicAutocomplete from "core/src/components/magic/MagicAutocomplete.vue";
import useProductsRealStore from "@/stores/products_real";
import type { Product, ProductReal } from "@/types/product";
import { ref } from "vue";

const productRealStore = useProductsRealStore();

interface ReservationProductLineProps {
  product?: Product;
}

const props = withDefaults(defineProps<ReservationProductLineProps>(), {});
const productReal = ref<ProductReal | null>();

function displayProductRealAutocomplete(productReal: ProductReal) {
  return `${productReal.reference}`;
}
function handleProductRealChange(_productReal: ProductReal) {
  productReal.value = _productReal;
}
</script>
<style lang="scss"></style>
