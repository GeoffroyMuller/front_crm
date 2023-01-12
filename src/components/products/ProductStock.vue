<template>
  <div class="product-stock">
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
      has-local-state
      :filters="{
        populate: ['product'],
        $eq: {
          idProduct: product?.id,
        },
      }"
      isCard
      :store="productsRealStore"
      @row-click="openSideProductReal"
    >
      <template #actions-title>
        <div>
          <Button
            color="success"
            icon="add"
            @click="
              (e) => {
                e.stopPropagation();
                openSideProductReal(null);
              }
            "
          >
            {{ $t("add") }}
          </Button>
        </div>
      </template>
    </MagicDataTable>

    <Sidebar v-model:open="isSidebarOpen">
      <div class="product-real-sidebar">
        <ProductRealForm :product="product" :productReal="currentProductReal" />
      </div>
    </Sidebar>
  </div>
</template>
<script setup lang="ts">
import MagicDataTable from "@/core/components/magic/MagicDataTable.vue";
import type { Product, ProductReal } from "@/types/product";
import useProductsRealStore from "@/stores/products_real";
import ProductRealForm from "./ProductRealForm.vue";

import Card from "@/core/components/Card.vue";
import Sidebar from "@/core/components/Sidebar.vue";
import { ref } from "vue";
import Button from "@/core/components/Button.vue";

interface ProductStockProps {
  product: Product | null;
}
const props = withDefaults(defineProps<ProductStockProps>(), {
  product: null,
});
const isSidebarOpen = ref<boolean>(false);
const productsRealStore = useProductsRealStore();

const currentProductReal = ref<ProductReal | null>(null);

const openSideProductReal = (productReal: ProductReal | null) => {
  currentProductReal.value = productReal;
  isSidebarOpen.value = true;
};
</script>
<style lang="scss">
.product-stock {
  @include grid(1, 0, 2);
}
.product-real-sidebar {
  padding: spacing(2);
}
</style>
