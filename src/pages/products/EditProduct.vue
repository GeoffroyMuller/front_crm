<template>
  <Page :title="$t('new_product')">
    <Button @click="goToProductsPage" variant="text" icon="chevron_left">{{
      $t("back")
    }}</Button>
    <div class="edit-product">
      <Card v-if="id != 'new'">
        <Tabs :tabs="productTabs">
          <template #informations>
            <ProductForm
              :product="product"
              @saved="handleSubmit"
              @cancel="goToProductsPage"
            >
            </ProductForm>
          </template>
          <template #stock>
            <div>stock</div>
          </template>
          <template #advanced_settings>
            <ProductAvancedSettings :product="product" @saved="handleSubmit" />
          </template>
        </Tabs>
      </Card>
      <Card v-else>
        <ProductForm
          :product="product"
          @saved="handleSubmit"
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
import { useRoute, useRouter } from "vue-router";
import { computed, onMounted, ref } from "vue";
import type { Product } from "@/types/product";
import Card from "@/core/components/Card.vue";
import Button from "@/core/components/Button.vue";
import Tabs from "@/core/components/Tabs.vue";
import { useI18n } from "vue-i18n";
import ProductAvancedSettings from "@/components/products/ProductAvancedSettings.vue";

const router = useRouter();
const { id } = useRoute().params;
const productsStore = useProductStore();
const { t } = useI18n();

const product = ref<Product | null>(null);

const productTabs = computed(() => {
  const res = [
    { id: "informations", title: t("informations") },
    { id: "stock", title: t("stock") },
    { id: "advanced_settings", title: t("advanced_settings") },
  ];
  if (product.value?.isNumeraryStock) {
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
  try {
    if (id != "new") {
      product.value = await productsStore.fetchById(id);
    }
  } catch (error) {
    console.error(error);
  }
});

async function handleSubmit(data: Product) {
  try {
    if (id != "new") {
      product.value = await productsStore.update(id, data);
    } else {
      await productsStore.create(data);
      goToProductsPage();
    }
  } catch (error) {
    console.error(error);
  }
}
</script>
<style lang="scss">
.edit-product {
  @include grid(1, 0, 2);
}
</style>
