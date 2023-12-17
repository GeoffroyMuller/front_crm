<template>
  <Card padding class="grid xl:grid-cols-[1fr_max-content] gap-6 items-start">
    <div class="typo-title5 font-semibold">
      <div class="mb-6 flex items-center gap-0.5">
        {{ $t("pages.edit-product.informations") }}
        <IconButton
          @click.stop="$emit('edit')"
          color="primary"
          default-colored
          size="xs"
          name="edit"
        />
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
    <ProdcutGallery :product="props.product" class="max-w-[500px]" />
  </Card>
</template>

<script setup lang="ts">
import useVatStore from "@/stores/vat";
import type { Product } from "@/types/product";
import Price from "core/src/components/Price.vue";
import IconButton from "core/src/components/IconButton.vue";
import { computed } from "vue";
import Card from "core/src/components/card/Card.vue";
import ProdcutGallery from "./ProductGallery.vue";

const vatStore = useVatStore();

const props = defineProps<{
  product: Product;
}>();

defineEmits(["edit"]);

const vat = computed(() =>
  props.product?.idVat
    ? vatStore.list.find((v) => v.id == props.product?.idVat)
    : null
);
</script>
