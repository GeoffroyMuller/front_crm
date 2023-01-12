<template>
  <Form :model-value="productReal" @submit="handleSubmit">
    <template #default="{ hasError }">
      <div class="title">
        {{ $t("new-product-real") }}
      </div>
      <div class="form-product-real">
        <TextField
          :rules="$yup.string().required()"
          name="reference"
          :label="$t('reference')"
        />

        <p
          v-if="
            product?.product_fields?.length != undefined &&
            product?.product_fields?.length > 0
          "
        >
          {{ $t("fields") }}
        </p>
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
import { isNil } from "lodash";

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

/* function mapData(data: any) {
  const res = { idProduct: props.product?.id, reference: data.reference };
  const realFields = Object.keys(data)
    .filter((elem: string) => elem.includes("field-"))
    .map((elem) => {
      const fieldId = elem.replace("field-", "");
      return { idProductField: fieldId, value: data[elem] };
    });

  return { ...res, product_real_fields: realFields };
} */
function mapDataFieldsInArray(data: any) {
  const realFields = Object.keys(data)
    .filter((elem: string) => elem.includes("field-"))
    .map((elem) => {
      const fieldId = elem.replace("field-", "");
      return { idProductField: fieldId, value: data[elem] };
    });

  return realFields;
}

function handleSubmit(data: any) {
  const productRealRes = {
    idProduct: props.product?.id,
    reference: data.reference,
    product_real_fields: mapDataFieldsInArray(data),
  };
  if (isNil(props.productReal)) {
    productRealStore.create(productRealRes);
  } else {
    productRealStore.update(productRealRes);
  }
  emit("saved", data);
}
</script>
<style lang="scss">
.form-product-real {
  padding: spacing(2);
  display: flex;
  flex-direction: column;
  gap: spacing(1);
  .title {
    margin-bottom: spacing(2);
  }
  .real-fields {
    @include grid(1, 0, 2);
  }
  .form-bottom {
    @include flex(row, flex-end, center, 2);
  }
}
</style>
