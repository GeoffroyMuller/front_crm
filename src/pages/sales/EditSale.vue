<template>
  <Page :title="title" :loading="loading">
    <Card>
      <SalesForm></SalesForm>
    </Card>
  </Page>
</template>

<script setup lang="ts">
import useSaleStore from "@/stores/sales";
import type { Sale } from "@/types/sale";
import type { ID } from "@/types/utils";
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import SalesForm from "@/components/sales/SalesForm.vue";
import Card from "@/core/components/Card.vue";
import Page from "@/components/Page.vue";

const { t } = useI18n();
const { id } = useRoute().params;
const salesStore = useSaleStore();

const sale = ref<Sale | null>(null);

const isNew = computed(() => id == "new");
const title = computed(() => {
  if (isNew.value) {
    return t("new-sale");
  }
  return `${t("sale")}`;
});
const loading = computed(() => {
  return isNew.value ? false : !sale.value;
});

onMounted(async () => {
  try {
    if (!isNew.value) {
      sale.value = await salesStore.fetchById(id as ID, {
        populate: ["customer"],
      });
    }
  } catch (error) {
    console.error(error);
  }
});
</script>
