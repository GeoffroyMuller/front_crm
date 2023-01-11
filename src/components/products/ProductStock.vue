<template>
  <div class="product-stock">
    <Card>
      <ProductRealForm :product="product" />
    </Card>

    <MagicDataTable
      :columns="[
        {
          title: $t('id'),
          key: 'id',
          sortable: true,
        },
        {
          title: $t('id_produit'),
          key: 'idProduct',
          sortable: true,
        },
        {
          title: $t('reference'),
          key: 'reference',
          sortable: true,
        },
      ]"
      isCard
      :store="productsRealStore"
    >
    </MagicDataTable>
  </div>
</template>
<script setup lang="ts">
import MagicDataTable from "@/core/components/magic/MagicDataTable.vue";
import type { Product } from "@/types/product";
import useProductsRealStore from "@/stores/products_real";
import ProductRealForm from "./ProductRealForm.vue";
import Card from "@/core/components/Card.vue";

interface ProductStockProps {
  product: Product | null;
}
const props = withDefaults(defineProps<ProductStockProps>(), {
  product: null,
});
const productsRealStore = useProductsRealStore();
</script>
<style lang="scss">
.product-stock {
  @include grid(1, 0, 2);
}
</style>
