<template>
  <div>
    <div class="title">
      {{ $t("edit-products-real") }}
    </div>
    <div class="text subline-form-subtitle">
      {{ $t("edit-products-real-product") }}
    </div>
    <Repetable v-if="product" name="sublines">
      <template #default>
        <MagicAutocomplete
          name="idProductReal"
          :label="$t('reference')"
          :getOptionLabel="displayProductRealAutocomplete"
          option-key="id"
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
      </template>
    </Repetable>
  </div>
</template>

<script setup lang="ts">
import Repetable from "@/core/components/form/repetable/Repetable.vue";
import MagicAutocomplete from "@/core/components/magic/MagicAutocomplete.vue";
import useProductsRealStore from "@/stores/products_real";
import type { Product, ProductReal } from "@/types/product";

interface QuoteSublineFormProps {
  product?: Product | null;
}
const props = withDefaults(defineProps<QuoteSublineFormProps>(), {});
const productRealStore = useProductsRealStore();

function displayProductRealAutocomplete(productReal: ProductReal) {
  return `${productReal.reference}`;
}
</script>

<style lang="scss" scoped>
.subline-form-subtitle {
  margin-bottom: spacing(2);
}
</style>
