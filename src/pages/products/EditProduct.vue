<template>
  <Page
    :title="
      id == 'new' && product == null
        ? $t('pages.edit-product.new-product')
        : product?.name || ''
    "
    :loading="id !== 'new' && product == null"
  >
    <Button
      class="btn-back"
      @click="goToProductsPage"
      variant="text"
      icon="chevron_left"
      >{{ $t("back") }}</Button
    >
    <div class="edit-product">
      <Tabs v-if="id != 'new'" :tabs="productTabs">
        <template #informations>
          <Card>
            <ProductForm
              :product="product"
              @saved="handleSubmit"
              @cancel="goToProductsPage"
            >
            </ProductForm>
          </Card>
        </template>
        <template #stock>
          <ProductStock :product="product" />
        </template>
        <template #advanced_settings>
          <Card>
            <ProductAvancedSettings :product="product" @saved="handleSubmit" />
          </Card>
        </template>
      </Tabs>
      <Card v-else>
        <ProductForm
          :product="product"
          @saved="handleSubmit"
          @cancel="goToProductsPage"
        >
        </ProductForm>
      </Card>
    </div>
  </Page>
</template>
<script setup lang="ts">
import ProductForm from "@/components/products/ProductForm.vue";
import Page from "@/components/Page.vue";
import useProductStore from "@/stores/products";
import { useRoute, useRouter } from "vue-router";
import { computed, onMounted, ref } from "vue";
import type { Product } from "@/types/product";
import Card from "@/core/components/Card.vue";
import Button from "@/core/components/Button.vue";
import Tabs from "@/core/components/Tabs.vue";
import { useI18n } from "vue-i18n";
import ProductAvancedSettings from "@/components/products/ProductAvancedSettings.vue";
import ProductStock from "@/components/products/ProductStock.vue";
import type { ID } from "@/types/utils";
import useUI from "@/core/helpers/vue/composables/ui";
import { isNil } from "lodash";

const router = useRouter();
const { id } = useRoute().params;
const productsStore = useProductStore();
const { t } = useI18n();
const { toast } = useUI();

const product = ref<Product | null>(null);

const productTabs = computed(() => {
  const res = [
    { id: "informations", title: t("informations") },
    { id: "stock", title: t("stock") },
    { id: "advanced_settings", title: t("advanced_settings") },
  ];
  if (!productsStore.isPhysicalStock(product.value)) {
    res.splice(
      res.findIndex((elem) => elem.id === "stock"),
      1
    );
  }
  return res;
});

const goToProductsPage = () => {
  router.push("/products");
};

onMounted(async () => {
  try {
    if (id != "new") {
      product.value = await productsStore.fetchById(id as ID, {
        populate: ["products_real", "product_fields"],
      });
    }
  } catch (error) {
    console.error(error);
  }
});

async function handleSubmit(
  data: Product,
  afterSaved: () => any | null,
  afterError: () => any | null
) {
  try {
    if (id != "new") {
      product.value = await productsStore.update(id as ID, data);
    } else {
      product.value = await productsStore.create(data);
      goToProductsPage();
    }
    if (!isNil(afterSaved)) {
      afterSaved();
    }
    toast({
      type: "success",
      message: t("saved"),
    });
  } catch (error: any) {
    console.error(error);
    if (!isNil(afterError)) {
      afterError();
    }
    toast({
      type: "danger",
      message: `${t("error_occured")}${": " + error?.message}`,
    });
  }
}
</script>
<style lang="scss">
.btn-back {
  margin-bottom: spacing(2);
}
.edit-product {
  @include grid(1, 0, 0);
}
</style>
