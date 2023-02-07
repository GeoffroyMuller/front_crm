<template>
  <Page
    back
    :title="
      id == 'new' && product == null
        ? $t('pages.edit-product.new-product')
        : product?.name || ''
    "
    :loading="id !== 'new' && product == null"
  >
    <div class="edit-product">
      <Tabs v-if="id != 'new'" :tabs="productTabs">
        <template #informations>
          <Card>
            <ProductForm
              :product="product"
              @saved="save"
              @cancel="goToProductsPage"
            >
            </ProductForm>
          </Card>
        </template>
        <template #stock>
          <ProductStock :product="product" />
        </template>
        <template #advanced_settings>
          <Card>
            <ProductAvancedSettings :product="product" @saved="save" />
          </Card>
        </template>
      </Tabs>
      <Card v-else>
        <ProductForm
          :product="product"
          @saved="save"
          @cancel="goToProductsPage"
        >
        </ProductForm>
      </Card>
    </div>
  </Page>
</template>
<script setup lang="ts">
import ProductForm from "@/components/products/ProductForm.vue";
import Page from "@/components/Page.vue";
import useProductStore from "@/stores/products";
import { computed, onMounted, ref } from "vue";
import Card from "@/core/components/Card.vue";
import Tabs from "@/core/components/Tabs.vue";
import ProductAvancedSettings from "@/components/products/ProductAvancedSettings.vue";
import ProductStock from "@/components/products/ProductStock.vue";
import useVatStore from "@/stores/vat";
import useEditPage from "@/components/editpage";
import type { Product } from "@/types/product";

const productsStore = useProductStore();
const vatStore = useVatStore();

const {
  router,
  model: product,
  id,
  save,
  t,
} = useEditPage<Product>({
  store: productsStore,
  populate: ["products_real", "product_fields"],
  onAdd: () => {
    goToProductsPage();
  },
});

const productTabs = computed(() => {
  const res = [
    { id: "informations", title: t("informations") },
    { id: "stock", title: t("stock") },
    { id: "advanced_settings", title: t("advanced_settings") },
  ];
  if (!productsStore.isPhysicalStock(product.value)) {
    res.splice(
      res.findIndex((elem) => elem.id === "stock"),
      1
    );
  }
  return res;
});

const goToProductsPage = () => {
  router.push("/products");
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
