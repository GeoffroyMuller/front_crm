<template>
  <div class="w-full">
    <div v-if="product.images?.[0]" class="w-full relative group">
      <img
        class="w-full object-cover h-[250px] rounded"
        :src="`${config.API_URL}/media/file/${product.images[0].filepath}`"
      />
      <div
        class="rounded absolute top-0 left-0 p-1 items-center justify-end w-full flex opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-all"
      >
        <div class="white-gradient" />
        <IconButton
          name="delete"
          color="white"
          @click="deleteImage(product.images[0])"
        />
      </div>
    </div>
    <div class="grid grid-cols-3 w-full gap-2 mt-2">
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
          class="rounded absolute top-0 left-0 p-1 items-center justify-end w-full flex opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-all"
        >
          <div class="white-gradient" />
          <IconButton name="delete" color="white" @click="deleteImage(image)" />
        </div>
      </div>
    </div>
    <UploadMedia class="mt-4" @validate="async (data) => uploadImage(data)" />
  </div>
</template>

<script setup lang="ts">
import UploadMedia from "@/components/UploadMedia.vue";
import config from "@/const";
import useProductsStore from "@/stores/products";
import useMediaStore from "@/stores/media";
import type { Product } from "@/types/product";
import axios from "axios";
import IconButton from "core/src/components/IconButton.vue";
import useUI from "core/src/composables/ui";
import { getJWT } from "core/src/helpers/utils";
import { useI18n } from "vue-i18n";

const props = defineProps<{
  product: Product;
}>();

const productsStore = useProductsStore();
const mediaStore = useMediaStore();

const { confirm, toast } = useUI();
const { t } = useI18n();

async function uploadImage(data: any) {
   try {
    await mediaStore.updateMedia(data.id, {
      id_model: props.product.id,
      model: 'product'
    });
  } catch (err) {
    console.error(err);
  } 
  
}

async function deleteImage(image: any) {
  const ok = await confirm({
    message: t("pages.edit-product.sure-delete-image"),
    type: "danger",
    actions: [
      {
        action: "cancel",
        label: t("cancel"),
        buttonProps: {
          variant: "text",
          color: "black",
        },
      },
      {
        action: "confirm",
        label: t("delete"),
        buttonProps: {
          color: "danger",
          icon: "delete",
        },
      },
    ],
  });
  if (ok) {
    try {
      await axios.delete(`${config.API_URL}/media/upload/${image.idMedia}`, {
        headers: { Authorization: getJWT() || "" },
      });
      await productsStore.deleteImage(props.product.id, image.id);
      toast({
        message: t("pages.edit-product.image-deleted"),
        type: "info",
      });
    } catch (err) {
      console.error(err);
    }
  }
}
</script>

<style lang="scss">
.white-gradient {
  @apply absolute top-0 left-0 w-full h-full rounded;
  background: linear-gradient(0, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.4) 100%);
}
</style>