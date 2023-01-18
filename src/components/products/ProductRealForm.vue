<template>
  <Form :model-value="productRealInternal" @submit="handleSubmit">
    <template #default="{ hasError, hasChanged }">
      <div class="title">
        {{
          productRealInternal?.id
            ? $t("pages.edit-product.edit-product-real")
            : $t("pages.edit-product.creat-product-real")
        }}
      </div>
      <div class="form-product-real">
        <TextField
          :rules="$yup.string().required()"
          name="reference"
          :label="$t('reference')"
        />

        <div class="real-fields">
          <Repetable
            name="product_real_fields"
            :label="$t('fields')"
            :min="productRealInternal?.product_real_fields?.length"
            :max="productRealInternal?.product_real_fields?.length"
          >
            <template #default="{ data }">
              {{ getFieldById(data.idProductField)?.type }}
              <MagicFormField
                :props="{ name: 'value' }"
                :label="
                  getFieldById(data.idProductField)?.name || data.idProductField
                "
                :type="'string'"
              />
            </template>
          </Repetable>
        </div>
        <div class="form-bottom">
          <Button @click="$emit('cancel')" variant="text">{{
            $t("cancel")
          }}</Button>
          <Button
            :disabled="hasError || !hasChanged"
            :loading="loading"
            type="submit"
            >{{ $t("save") }}</Button
          >
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
import type {
  Product,
  ProductField,
  ProductReal,
  ProductRealField,
} from "@/types/product";
import { isNil } from "lodash";
import Repetable from "@/core/components/form/repetable/Repetable.vue";
import { ref, watch } from "vue";
import type { ID } from "@/types/utils";
import MagicFormField from "@/core/components/magic/MagicFormField.vue";
import useUI from "@/core/helpers/vue/composables/ui";
import { useI18n } from "vue-i18n";

interface ProductRealFormProps {
  product: Product | null;
  productReal: ProductReal | null;
  afterSaved: () => any | null;
}

const { t } = useI18n();
const { toast } = useUI();
const productRealStore = useProductRealStore();
const emit = defineEmits(["cancel", "update:product"]);
const props = withDefaults(defineProps<ProductRealFormProps>(), {
  product: null,
  productReal: null,
});
const productRealInternal = ref<ProductReal | null>(null);
const loading = ref<boolean>(false);

watch(
  () => props.productReal,
  (val) => {
    if (isNil(val)) {
      initProductRealInternal();
    } else {
      const productRealFields = mergeRealFieldsWithFields(val, props.product);
      productRealInternal.value = {
        ...val,
        product_real_fields: productRealFields,
      };
    }
    loading.value = false;
  },
  { immediate: true }
);

function initProductRealInternal() {
  productRealInternal.value = null;
  productRealInternal.value = {
    product_real_fields: props.product?.product_fields?.map((field) => {
      return { idProductField: field.id };
    }),
  };
}

function mergeRealFieldsWithFields(
  productReal: ProductReal,
  product: Product | null
) {
  return product?.product_fields?.map((field) => {
    const realFieldExist = productReal.product_real_fields?.find(
      (elem) => elem.idProductField == field.id
    );
    if (!isNil(realFieldExist)) {
      return realFieldExist;
    }

    return { idProductReal: productReal.id, idProductField: field.id };
  });
}

function getFieldById(id: ID) {
  return props.product?.product_fields?.find(
    (field: ProductField) => field.id === id
  );
}

async function handleSubmit(data: any) {
  try {
    loading.value = true;
    if (isNil(props.productReal)) {
      await productRealStore.create({ idProduct: props.product?.id, ...data });
      initProductRealInternal();
    } else if (!isNil(props.productReal.id)) {
      await productRealStore.update(props.productReal.id, {
        ...props.productReal,
        ...data,
        product_real_fields: data.product_real_fields?.map(
          (field: ProductRealField) => {
            return {
              ...field,
              idProductReal: props.productReal ? props.productReal.id : null,
            };
          }
        ),
      });
    }
    if (!isNil(props.afterSaved)) {
      props.afterSaved();
    }
    toast({
      type: "success",
      message: t("saved"),
    });
  } catch (error: any) {
    loading.value = false;
    console.error(error);
    toast({
      type: "danger",
      message: `${t("error_occured")}${": " + error?.message}`,
    });
  }
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
