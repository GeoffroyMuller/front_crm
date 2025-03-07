<template>
  <Page :title="$t('products')" icon="inventory_2">
    <template #head-end>
      <Button
        @click="$router.push({ name: 'products-id', params: { id: 'new' } })"
        variant="outlined"
        color="success"
      >
        {{ $t("add-menu.add-product") }}
      </Button>
    </template>
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
        <Price :price="item.price" />
      </template>
      <template #content-description="{ item }">
        <div
          class="line-clamp-2"
          v-if="item.description"
          v-html="item.description"
        ></div>
      </template>
      <template #actions-title>
        <div>
          <IconButton
            color="success"
            name="add"
            v-tooltip="{ text: $t('add'), placement: 'top' }"
            @click="
              $router.push({ name: 'products-id', params: { id: 'new' } })
            "
          />
        </div>
      </template>
    </MagicDataTable>
  </Page>
</template>

<script lang="ts" setup>
import MagicDataTable from "core/src/components/magic/MagicDataTable.vue";
import Button from "core/src/components/Button.vue";
import Page from "core/src/components/Page.vue";
import useProductStore from "@/stores/products";
import type { Product } from "@/types/product";
import MagicFilterBar from "core/src/components/magic/MagicFilterBar.vue";
import Price from "core/src/components/Price.vue";
import IconButton from "core/src/components/IconButton.vue";

const productsStore = useProductStore();
</script>