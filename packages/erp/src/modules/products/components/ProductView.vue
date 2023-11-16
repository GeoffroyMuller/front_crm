<template>
  <div class="grid grid-cols-2 gap-6 items-start">
    <div class="typo-title5 font-semibold">
      <div class="mb-6">
        {{ $t("pages.edit-product.informations") }}
      </div>
      <div class="grid gap-5">
        <div class="flex gap-2" v-if="product.name">
          <div class="text-slate-400">
            {{ $t("pages.edit-product.name") }}
          </div>
          <div class="text-slate-500">
            {{ product.name }}
          </div>
        </div>
        <div v-if="product?.description">
          <div class="text-slate-400">
            {{ $t("pages.edit-product.description") }}
          </div>
          <div
            class="text-slate-500 mt-2 max-w-xl font-normal"
            v-html="product.description"
          />
        </div>

        <div v-if="product.price" class="text-slate-400 flex items-start gap-2">
          <span>
            {{ $t("pages.edit-product.unit-price") }}
          </span>
          <Price :price="product.price" />
        </div>
        <div v-if="vat" class="flex gap-2 items-center">
          <span class="text-slate-400">
            {{ $t("pages.edit-product.vat") }}
          </span>
          <span class="text-slate-500"> {{ vat.rate }} % </span>
        </div>
      </div>
    </div>
    <div>
      <img
        class="w-full rounded"
        src="https://99designs-blog.imgix.net/blog/wp-content/uploads/2016/03/web-images.jpg?auto=format&q=60&w=1600&h=824&fit=crop&crop=faces"
      />
      <div class="grid grid-cols-3 gap-2 mt-2 [&>*]:w-full [&>*]:rounded">
        <img
          src="https://99designs-blog.imgix.net/blog/wp-content/uploads/2016/03/web-images.jpg?auto=format&q=60&w=1600&h=824&fit=crop&crop=faces"
        />
        <img
          src="https://99designs-blog.imgix.net/blog/wp-content/uploads/2016/03/web-images.jpg?auto=format&q=60&w=1600&h=824&fit=crop&crop=faces"
        />
        <img
          src="https://99designs-blog.imgix.net/blog/wp-content/uploads/2016/03/web-images.jpg?auto=format&q=60&w=1600&h=824&fit=crop&crop=faces"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import useVatStore from "@/stores/vat";
import type { Product } from "@/types/product";
import Price from "core/src/components/Price.vue";
import { onMounted } from "vue";
import { computed } from "vue";

const vatStore = useVatStore();

const props = defineProps<{
  product: Product;
}>();

const vat = computed(() =>
  props.product?.idVat
    ? vatStore.list.find((v) => v.id == props.product?.idVat)
    : null
);
</script>
