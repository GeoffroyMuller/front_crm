<template>
  <div>
    <div class="relative group">
      <img
        class="w-full object-cover h-[250px] rounded"
        v-if="product.images?.[0]"
        :src="`${config.API_URL}/media/file/${product.images[0].filepath}`"
      />
      <div
        class="absolute top-1 right-1 items-center w-fit hidden group-hover:flex"
      >
        <IconButton name="delete" color="white" class="" />
      </div>
    </div>
    <div class="grid grid-cols-3 gap-2 mt-2">
      <div
        class="relative group"
        v-for="image of product.images?.slice(1, 4)"
        :key="image.idMedia"
      >
        <img
          :src="`${config.API_URL}/media/file/${image.filepath}`"
          alt=""
          class="object-cover h-[100px] w-full rounded"
        />
        <div
          class="absolute top-1 right-1 items-center w-fit hidden group-hover:flex"
        >
          <IconButton name="delete" color="white" class="" />
        </div>
      </div>
    </div>
    <UploadMedia class="mt-4" @validate="async (data) => uploadImage(data)" />
  </div>
</template>

<script setup lang="ts">
import UploadMedia from "@/components/UploadMedia.vue";
import config from "@/const";
import useProductsStore from "@/modules/products/stores/products";
import type { Product } from "@/types/product";
import IconButton from "core/src/components/IconButton.vue";

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
