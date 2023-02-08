<template>
  <Page :title="$t('products')">
    <MagicFilterBar
      :map="{ name: '$contains.name' }"
      :filters="[{ type: 'string', props: { label: 'name', name: 'name' } }]"
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
      <template #content-price="{ item }">
        {{ $utils.formatPrice(item.price) }}
      </template>
      <template #content-description="{ item }">
        <div v-if="item.description" v-html="item.description"></div>
      </template>
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
import MagicFilterBar from "@/core/components/magic/MagicFilterBar.vue";

const productsStore = useProductStore();
</script>
