<template>
  <Page :title="$t('new_product_real')">
    <div class="edit-product-real">
      <Card>
        <ProductRealForm :product="product" :product-real="productReal" />
      </Card>
    </div>
  </Page>
</template>
<script setup lang="ts">
import Page from "@/components/Page.vue";
import ProductRealForm from "@/components/products/ProductRealForm.vue";
import useProductStore from "@/stores/products";
import { useRoute, useRouter } from "vue-router";
import Card from "@/core/components/Card.vue";
import type { Product, ProductReal } from "@/types/product";
import { onMounted, ref } from "vue";
import { isNil } from "lodash";
import useProductsRealStore from "@/stores/products_real";

const productsStore = useProductStore();
const productsRealStore = useProductsRealStore();

const product = ref<Product | null>(null);
const productReal = ref<ProductReal | null>(null);

const { id, idProduct } = useRoute().params;

onMounted(async () => {
  try {
    if (!isNil(id)) {
      const res = await productsRealStore.fetchById(id, {
        populate: ["product"],
      });
      productReal.value = res;
      product.value = res.product;
    } else if (!isNil(idProduct)) {
      product.value = await productsStore.fetchById(idProduct);
    }
  } catch (error) {
    console.error(error);
  }
});
</script>
<style lang="scss"></style>
