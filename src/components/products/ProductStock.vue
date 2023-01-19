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
        populate: ['product', 'product_real_fields'],
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
      <div class="loading-spinner" v-if="loadingProductReal">
        <Spinner size="md" />
      </div>
      <div v-else class="product-real-sidebar">
        <ProductRealForm
          :afterSaved="() => (isSidebarOpen = false)"
          :product="product"
          :productReal="currentProductReal"
        />
      </div>
    </Sidebar>
  </div>
</template>
<script setup lang="ts">
import MagicDataTable from "@/core/components/magic/MagicDataTable.vue";
import type { Product, ProductReal } from "@/types/product";
import useProductsRealStore from "@/stores/products_real";
import ProductRealForm from "./ProductRealForm.vue";

import Sidebar from "@/core/components/Sidebar.vue";
import { ref } from "vue";
import Button from "@/core/components/Button.vue";
import { isNil } from "lodash";
import Spinner from "@/core/components/Spinner.vue";

interface ProductStockProps {
  product: Product | null;
}
const props = withDefaults(defineProps<ProductStockProps>(), {
  product: null,
});
const isSidebarOpen = ref<boolean>(false);
const productsRealStore = useProductsRealStore();
const loadingProductReal = ref<boolean>(false);

const currentProductReal = ref<ProductReal | null>(null);

const openSideProductReal = async (productReal: ProductReal | null) => {
  if (!isNil(productReal) && !isNil(productReal.id)) {
    try {
      loadingProductReal.value = true;

      currentProductReal.value = await productsRealStore.fetchById(
        productReal?.id,
        {
          populate: ["product_real_fields"],
        }
      );
      isSidebarOpen.value = true;
      loadingProductReal.value = false;
    } catch (error) {
      isSidebarOpen.value = false;
      loadingProductReal.value = false;
      console.error(error);
    }
  } else {
    currentProductReal.value = null;
    isSidebarOpen.value = true;
  }
};
</script>
<style lang="scss">
.product-stock {
  @include grid(1, 0, 2);
}
.loading-spinner {
  width: 100%;
  height: 100%;
  @include flex(col, center, center);
}
.product-real-sidebar {
  padding: spacing(2);
  width: 100%;
  height: 100%;
}
</style>
