<template>
  <Page :title="$t('new_product')">
    <Card>
      <ProductForm :product="product" @saved="handleSaved"> </ProductForm>
    </Card>
  </Page>
</template>
<script setup lang="ts">
import ProductForm from "@/components/products/ProductForm.vue";
import Page from "@/components/Page.vue";
import useProductStore from "@/stores/products";
import { useRoute, useRouter } from "vue-router";
import { onMounted, ref } from "vue";
import type { Product } from "@/types/product";
import Card from "@/core/components/Card.vue";

const router = useRouter();
const { id } = useRoute().params;
const productsStore = useProductStore();

const product = ref<Product | null>(null);

const handleSaved = () => {
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
</script>
