<template>
  <Page
    icon="inventory_2"
    :title="
      id == 'new' && product == null
        ? $t('pages.edit-product.new-product')
        : product?.name || ''
    "
    :loading="loadingPage"
  >
    <div class="edit-product">
      <Tabs v-if="id != 'new'" :tabs="productTabs">
        <template #informations>
          <Card padding>
            <ProductForm
              :product="product"
              @saved="save"
              @cancel="goToProductsPage"
              :loading="loading"
            >
            </ProductForm>
          </Card>
        </template>
        <template #stock>
          <ProductStock :product="product" />
        </template>
        <template #advanced_settings>
          <Card padding>
            <ProductAvancedSettingsPhysical
              v-if="productsStore.isPhysicalStock(product)"
              :loading="loading"
              :product="product"
              @saved="save"
            />
            <ProductAdvancedSettingsEvents
              v-if="productsStore.isEventStock(product)"
              :product="product"
            />
          </Card>
        </template>
      </Tabs>
      <Card padding v-else>
        <ProductForm
          :product="product"
          @saved="save"
          @cancel="goToProductsPage"
          :loading="loading"
        >
        </ProductForm>
      </Card>
    </div>
  </Page>
</template>
<script setup lang="ts">
import ProductForm from "@/modules/products/components/ProductForm.vue";
import Page from "core/src/components/Page.vue";
import useProductStore from "@/modules/products/stores/products";
import { computed, onMounted, ref } from "vue";
import Card from "core/src/components/card/Card.vue";
import Tabs from "core/src/components/Tabs.vue";
import ProductAvancedSettingsPhysical from "@/modules/products/components/ProductAvancedSettingsPhysical.vue";
import ProductStock from "@/modules/products/components/ProductStock.vue";
import useVatStore from "@/stores/vat";
import useEditPage from "@/components/editpage";
import type { Product } from "@/types/product";
import ProductAdvancedSettingsEvents from "@/modules/products/components/ProductAdvancedSettingsEvents.vue";

const productsStore = useProductStore();
const vatStore = useVatStore();

const {
  router,
  model: product,
  id,
  save,
  t,
  loading,
  loadingPage,
} = useEditPage<Product>({
  store: productsStore,
  populate: ["products_real", "product_fields"],
  onAdd: () => {
    goToProductsPage();
  },
});

const productTabs = computed(() => {
  const res = [{ id: "informations", title: t("informations") }];

  if (
    productsStore.isPhysicalStock(product.value) ||
    productsStore.isEventStock(product.value)
  ) {
    if (productsStore.isPhysicalStock(product.value)) {
      res.push({ id: "stock", title: t("stock") });
    }
    res.push({ id: "advanced_settings", title: t("advanced_settings") });
  }

  return res;
});

const goToProductsPage = () => {
  router.push({ name: "products" });
};

onMounted(async () => {
  vatStore.fetchList();
});
</script>
<style lang="scss">
.edit-product {
  @include grid(1, 0, 0);
}
</style>
