<template>
  <div>
    <div class="typo-title">
      {{ $t("edit-products-real") }}
    </div>
    <div class="typo-text subline-form-subtitle">
      {{ $t("edit-products-real-product") }}
    </div>
    <Repetable v-model="sublines" v-if="product" name="sublines">
      <template #default>
        <MagicAutocomplete
          name="idProductReal"
          :label="$t('reference')"
          :getOptionLabel="displayProductRealAutocomplete"
          option-key="id"
          :get-option-value="(opt) => opt.id"
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
import Repetable from "core/src/components/form/repetable/Repetable.vue";
import MagicAutocomplete from "core/src/components/magic/MagicAutocomplete.vue";
import useProductsRealStore from "@/stores/products_real";
import type { Product, ProductReal } from "@/types/product";
import type { SaleSubline } from "@/types/sale";
import { isNil } from "lodash";
import { computed, ref, watch } from "vue";

interface QuoteSublineFormProps {
  product?: Product | null;
  count?: number;
}
const props = withDefaults(defineProps<QuoteSublineFormProps>(), {});
const productRealStore = useProductsRealStore();

const emit = defineEmits(["update:count"]);

const sublines = ref([]);

const count = computed(
  () =>
    sublines.value.filter((subline: SaleSubline) => {
      if (!isNil(subline?.idProductReal)) {
        return true;
      } else {
        return false;
      }
    }).length
);

watch(
  () => count.value,
  (val) => {
    if (!isNil(val)) {
      emit("update:count", val);
    }
  },
  { immediate: false }
);

function displayProductRealAutocomplete(productReal: ProductReal) {
  return `${productReal.reference}`;
}
</script>

<style lang="scss" scoped>
.subline-form-subtitle {
  margin-bottom: spacing(2);
}
</style>
