<template>
  <Form :model-value="productReal" @submit="handleSubmit">
    <template #default="{ hasError }">
      <div class="form-product-real">
        <TextField name="reference" :label="$t('reference')" />

        <p>{{ $t("fields") }}</p>
        <div class="real-fields">
          <div
            v-for="field in product?.product_fields"
            :key="field.id"
            class="real-field"
          >
            <TextField :name="`field-${field.id}`" :label="field.name" />
          </div>
        </div>
        <div class="form-bottom">
          <Button @click="$emit('cancel')" variant="text">{{
            $t("cancel")
          }}</Button>
          <Button :disabled="hasError" type="submit">{{ $t("save") }}</Button>
        </div>
      </div>
    </template>
  </Form>
</template>
<script setup lang="ts">
import Form from "@/core/components/form/Form.vue";
import Button from "@/core/components/Button.vue";
import TextField from "@/core/components/form/TextField.vue";
import useProductRealStore from "@/stores/products_real";
import type { Product, ProductReal } from "@/types/product";

interface ProductRealFormProps {
  product: Product | null;
  productReal: ProductReal | null;
}

const productRealStore = useProductRealStore();
const emit = defineEmits(["saved", "cancel", "update:product"]);
const props = withDefaults(defineProps<ProductRealFormProps>(), {
  product: null,
  productReal: null,
});

function mapData(data: any) {
  const res = { idProduct: props.product?.id, reference: data.reference };
  const realFields = Object.keys(data)
    .filter((elem: string) => elem.includes("field-"))
    .map((elem) => {
      const fieldId = elem.replace("field-", "");
      return { idProductField: fieldId, value: data[elem] };
    });

  return { ...res, product_real_fields: realFields };
}

function handleSubmit(data: any) {
  const productRealRes = mapData(data);
  productRealStore.create(productRealRes);
  emit("saved", data);
}
</script>
<style lang="scss">
.form-product-real {
  @include grid(1, 0, 2);
  .real-fields {
    @include grid(1, 0, 2);
  }
  .form-bottom {
    @include flex(row, flex-end, center, 2);
  }
}
</style>
