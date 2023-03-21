<template>
  <div class="product-stock">
    <MagicDataTable
      :columns="[
        {
          title: $t('reference'),
          key: 'reference',
          sortable: true,
        },
      ]"
      isCard
      :store="store"
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

    <Sidebar v-model:open="isSidebarOpen" padding>
      <div class="loading-spinner" v-if="loadingProductReal">
        <Spinner size="md" />
      </div>
      <div v-else class="product-real-sidebar">
        <ProductRealForm
          @saved="
            () => {
              isSidebarOpen = false;
              fetchProductsReal();
            }
          "
          :product="product"
          :productReal="currentProductReal"
        />
      </div>
    </Sidebar>
  </div>
</template>
<script setup lang="ts">
import MagicDataTable from "core/src/components/magic/MagicDataTable.vue";
import type { Product, ProductReal } from "@/types/product";
import ProductRealForm from "./ProductRealForm.vue";
import Sidebar from "core/src/components/Sidebar.vue";
import { ref } from "vue";
import Button from "core/src/components/Button.vue";
import { isNil } from "lodash";
import Spinner from "core/src/components/Spinner.vue";
import useUI from "core/src/composables/ui";
import useProductsStore from "@/stores/products";

interface ProductStockProps {
  product: Product | null;
}
const props = withDefaults(defineProps<ProductStockProps>(), {
  product: null,
});
const isSidebarOpen = ref<boolean>(false);
const productsStore = useProductsStore();

const store = productsStore.getDerivedStore<ProductReal>(
  props.product?.id as string,
  "real",
  {
    path: "products_real",
    filters: {
      $eq: {
        idProduct: props.product?.id,
      },
    },
  }
);

const loadingProductReal = ref<boolean>(false);
const { toast } = useUI();

const currentProductReal = ref<ProductReal | null>(null);

async function fetchProductsReal() {
  try {
    await store.fetchList();
  } catch (error: any) {
    toast({
      type: "danger",
      message: error.response.data.message,
    });
  }
}

const openSideProductReal = async (productReal: ProductReal | null) => {
  if (!isNil(productReal) && !isNil(productReal.id)) {
    try {
      loadingProductReal.value = true;

      currentProductReal.value = await store.fetchById(productReal?.id, {
        populate: ["product_real_fields"],
      });
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
  width: 100%;
  height: 100%;
}
</style>
