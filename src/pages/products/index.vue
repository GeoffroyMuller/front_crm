<template>
  <Page :title="$t('products')">
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
          title: $t('stock-management'),
          key: 'stockManagement',
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
      @row-click="(product: Product) => $router.push(`/products/${product.id}`)"
    >
      <template #actions-title>
        <div>
          <Button
            color="success"
            icon="add"
            v-tooltip="{ text: $t('add'), placement: 'bottom' }"
            @click="$router.push(`/products/new`)"
          >
            {{ $t("add") }}
          </Button>
        </div>
      </template>
      <template #content-stock="{ item }">
        <div>
          {{ productsStore.isNumeraryStock(item) ? item.stock : "-" }}
        </div>
      </template>
      <template #content-stockManagement="{ item }">
        <div>
          {{
            $_.isNil(item.stockManagement)
              ? $t("none")
              : $t(item.stockManagement)
          }}
        </div>
      </template>
    </MagicDataTable>
  </Page>
</template>

<script lang="ts" setup>
import MagicDataTable from "@/core/components/magic/MagicDataTable.vue";
import Button from "@/core/components/Button.vue";
import Page from "@/components/Page.vue";
import useProductStore from "@/stores/products";
import type { Product } from "@/types/product";

const productsStore = useProductStore();
</script>
