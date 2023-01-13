<template>
  <Form :model-value="productRealInternal" @submit="handleSubmit">
    <template #default="{ hasError }">
      <div class="title">
        {{
          productRealInternal?.id
            ? $t("edit-product-real")
            : $t("new-product-real")
        }}
      </div>
      <div class="form-product-real">
        <TextField
          :rules="$yup.string().required()"
          name="reference"
          :label="$t('reference')"
        />

        <div class="real-fields">
          <Repetable name="product_real_fields" :label="$t('fields')">
            <template #default="{ data }">
              {{ data }}
              <TextField name="value" :label="data.idProductField" />
            </template>
          </Repetable>
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
import Repetable from "@/core/components/form/repetable/Repetable.vue";
import { ref, watch } from "vue";

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
const productRealInternal = ref<ProductReal | null>(null);

watch(
  () => props.productReal,
  (val) => {
    if (isNil(val)) {
      productRealInternal.value = {
        product_real_fields: props.product?.product_fields?.map((field) => {
          return { idProductReal: undefined, idProductField: field.id };
        }),
      };
    } else {
      productRealInternal.value = val;
    }
  },
  { immediate: true }
);

function handleSubmit(data: any) {
  console.error({ data });
  if (isNil(props.productReal)) {
    productRealStore.create({ idProduct: props.product?.id, ...data });
  } else if (!isNil(props.productReal.id)) {
    productRealStore.update(props.productReal.id, {
      ...props.productReal,
      ...data,
      product_real_fields: props.productReal.product_real_fields?.map(
        (field) => {
          return {
            ...field,
            idProductReal: props.productReal ? props.productReal.id : "",
          };
        }
      ),
    });
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
