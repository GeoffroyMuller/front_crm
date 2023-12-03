<template>
  <Page
    icon="inventory_2"
    :title="
      id == 'new' && product == null
        ? $t('pages.edit-product.new-product')
        : product?.name || ''
    "
    :loading="loadingPage"
    :tabs="id != 'new' ? productTabs : undefined"
  >
    <template #head-end>
      <Button
        v-if="id != 'new'"
        variant="outlined"
        color="primary"
        @click.stop="editSidebarOpen = true"
      >
        {{ $t("edit") }}
      </Button>
    </template>
    <template #informations>
      <Card padding>
        <ProductView :product="product" @edit="editSidebarOpen = true" />
      </Card>
    </template>
    <template #stock>
      <ProductStock :product="product" />
    </template>
    <template #advanced_settings>
      <ProductAdvancedSettingsPhysical
        v-if="productsStore.isPhysicalStock(product)"
        :loading="loading"
        :product="product"
        @saved="saveFields"
      />
    </template>

    <Card padding v-if="id == 'new'">
      <ProductForm
        :product="product"
        @saved="save"
        @cancel="goToProductsPage"
        :loading="loading"
      >
        <template #end>
          <Button color="success" type="submit">{{ $t("add") }}</Button>
        </template>
      </ProductForm>
    </Card>
    <Sidebar
      v-model:open="editSidebarOpen"
      contentClass="md:min-w-[800px] md:max-w-[800px]"
    >
      <SidebarHead :actions="[]" :title="product?.name"> </SidebarHead>

      <SidebarContent>
        <ProductForm
          :product="product"
          @saved="save"
          @cancel="goToProductsPage"
          :loading="loading"
        >
          <template #end>
            <SidebarActions class="flex justify-end gap-2">
              <Button color="success" type="submit">{{ $t("save") }}</Button>
            </SidebarActions>
          </template>
        </ProductForm>
      </SidebarContent>
    </Sidebar>
  </Page>
</template>
<script setup lang="ts">
import ProductForm from "@/modules/products/components/ProductForm.vue";
import Page from "core/src/components/Page.vue";
import useProductStore from "@/modules/products/stores/products";
import { computed, onMounted, ref } from "vue";
import Card from "core/src/components/card/Card.vue";
import ProductAdvancedSettingsPhysical from "@/modules/products/components/ProductAdvancedSettingsPhysical.vue";
import ProductStock from "@/modules/products/components/ProductStock.vue";
import useVatStore from "@/stores/vat";
import useEditPage from "@/components/editpage";
import type { Product, ProductField } from "@/types/product";
import ProductView from "../components/ProductView.vue";
import Sidebar from "core/src/components/sidebar/Sidebar.vue";
import SidebarHead from "core/src/components/sidebar/SidebarHead.vue";
import SidebarContent from "core/src/components/sidebar/SidebarContent.vue";
import Button from "core/src/components/Button.vue";
import SidebarActions from "core/src/components/sidebar/SidebarActions.vue";

const productsStore = useProductStore();
const vatStore = useVatStore();

const editSidebarOpen = ref(false);

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

function saveFields(fields: ProductField[]) {
  console.error({ fields });
}

const productTabs = computed(() => {
  const res = [{ id: "informations", title: t("informations") }];

  if (productsStore.isPhysicalStock(product.value)) {
    res.push({ id: "stock", title: t("stock") });
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
