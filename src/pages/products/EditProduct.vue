<template>
  <Page :title="$t('new_product')">
    <Button
      class="btn-back"
      @click="goToProductsPage"
      variant="text"
      icon="chevron_left"
      >{{ $t("back") }}</Button
    >
    <div class="edit-product">
      <Tabs v-if="id != 'new'" :tabs="productTabs">
        <template #informations>
          <Card>
            <ProductForm
              :product="product"
              @saved="handleSubmit"
              @cancel="goToProductsPage"
            >
            </ProductForm>
          </Card>
        </template>
        <template #stock>
          <ProductStock :product="product" />
        </template>
        <template #advanced_settings>
          <Card
            ><ProductAvancedSettings :product="product" @saved="handleSubmit" />
          </Card>
        </template>
      </Tabs>
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
import ProductStock from "@/components/products/ProductStock.vue";

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
      await productsStore.update(id, data);
      product.value = { ...product.value, ...data };
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
.btn-back {
  margin-bottom: spacing(2);
}
.edit-product {
  @include grid(1, 0, 0);
}
</style>
