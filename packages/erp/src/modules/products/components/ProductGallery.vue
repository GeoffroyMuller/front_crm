<template>
  <div>
    <img
      class="w-full rounded"
      v-if="product.images?.[0]"
      :src="`${config.API_URL}/media/file/${product.images[0].filepath}`"
    />
    <div
      class="grid grid-cols-3 gap-2 mt-2 [&>*]:w-full [&>*]:h-[100px] [&>*]:object-cover [&>*]:rounded"
    >
      <img
        v-for="image of product.images?.slice(1, 4)"
        :key="image.idMedia"
        :src="`${config.API_URL}/media/file/${image.filepath}`"
        alt=""
      />
    </div>
    <UploadMedia class="mt-4" @validate="async (data) => uploadImage(data)" />
  </div>
</template>

<script setup lang="ts">
import UploadMedia from "@/components/UploadMedia.vue";
import config from "@/const";
import useProductsStore from "@/modules/products/stores/products";
import type { Product } from "@/types/product";

const props = defineProps<{
  product: Product;
}>();

const productsStore = useProductsStore();

async function uploadImage(data: any) {
  try {
    await productsStore.addImage(props.product.id, {
      idMedia: data.id,
      filepath: data.filepath,
    });
  } catch (err) {
    console.error(err);
  }
}
</script>
