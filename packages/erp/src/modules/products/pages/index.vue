<template>
  <Page :title="$t('products')" class="grid gap-4">
    <MagicFilterBar
      mapSearch="$contains.name"
      :filters="[]"
      :map="{}"
      :store="productsStore"
    />
    <MagicDataTable
      :store="productsStore"
      :columns="[
        {
          title: $t('name'),
          key: 'name',
          sortable: true,
        },
        {
          title: $t('description'),
          key: 'description',
          sortable: true,
        },
        {
          title: $t('quantity'),
          key: 'stock',
          sortable: true,
        },
        {
          title: $t('price'),
          key: 'price',
          sortable: true,
        },
      ]"
      @row-click="(product: Product) => $router.push({name: 'products-id', params: {id: product.id}})"
    >
      <template #content-stock="{ item }">
        {{
          productsStore.isPhysicalStock(item)
            ? item.stock_physical
            : productsStore.isNumeraryStock(item)
            ? item.stock
            : "-"
        }}
      </template>
      <template #content-price="{ item }">
        {{ $utils.formatPrice(item.price) }}
      </template>
      <template #content-description="{ item }">
        <div
          class="line-clamp-3"
          v-if="item.description"
          v-html="item.description"
        ></div>
      </template>
      <template #actions-title>
        <div>
          <Button
            color="success"
            icon="add"
            v-tooltip="{ text: $t('add'), placement: 'bottom' }"
            @click="
              $router.push({ name: 'products-id', params: { id: 'new' } })
            "
          >
            {{ $t("add") }}
          </Button>
        </div>
      </template>
    </MagicDataTable>
  </Page>
</template>

<script lang="ts" setup>
import MagicDataTable from "core/src/components/magic/MagicDataTable.vue";
import Button from "core/src/components/Button.vue";
import Page from "@/components/Page.vue";
import useProductStore from "@/modules/products/stores/products";
import type { Product } from "@/types/product";
import MagicFilterBar from "core/src/components/magic/MagicFilterBar.vue";

const productsStore = useProductStore();
</script>
