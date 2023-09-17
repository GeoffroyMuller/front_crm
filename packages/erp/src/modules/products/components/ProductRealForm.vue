<template>
  <SidebarHead
    :title="
      productRealInternal?.id
        ? $t('pages.edit-product.edit-product-real')
        : $t('pages.edit-product.creat-product-real')
    "
    :actions="[]"
  >
  </SidebarHead>
  <SidebarContent>
    <Form
      shortcuts
      :initial-value="productRealInternal"
      @submit="handleSubmit"
      class="flex flex-col gap-4"
    >
      <template #default="{ hasError, hasChanged }">
        <TextField
          :rules="$yup.string().required()"
          name="reference"
          :label="$t('reference')"
        />

        <Repetable
          name="product_real_fields"
          :label="$t('fields')"
          :min="productRealInternal?.product_real_fields?.length"
          :max="productRealInternal?.product_real_fields?.length"
        >
          <template #default="{ data }">
            <MagicFormField
              :props="{
                ...getFieldById(data.idProductField)?.props,
                name: 'value',
              }"
              :label="
                getFieldById(data.idProductField)?.name || data.idProductField
              "
              :type="getFieldById(data.idProductField)?.type || 'string'"
            />
          </template>
        </Repetable>

        <SidebarActions class="flex justify-end items-center">
          <Button
            :disabled="hasError || !hasChanged"
            :loading="loading"
            type="submit"
            v-tooltip="{
              text: $t('keyboardshortcuts.ctrl+s'),
              placement: 'bottom',
            }"
            >{{ $t("save") }}</Button
          >
        </SidebarActions>
      </template>
    </Form>
  </SidebarContent>
</template>
<script setup lang="ts">
import Form from "core/src/components/form/Form.vue";
import Button from "core/src/components/Button.vue";
import TextField from "core/src/components/form/TextField.vue";
import useProductRealStore from "@/stores/products_real";
import type {
  Product,
  ProductField,
  ProductReal,
  ProductRealField,
} from "@/types/product";
import { isNil } from "lodash";
import Repetable from "core/src/components/form/repetable/Repetable.vue";
import { ref, watch } from "vue";
import type { ID } from "core/src/types";
import MagicFormField from "core/src/components/magic/MagicFormField.vue";
import useUI from "core/src/composables/ui";
import { useI18n } from "vue-i18n";
import SidebarActions from "core/src/components/sidebar/SidebarActions.vue";
import SidebarHead from "core/src/components/sidebar/SidebarHead.vue";
import SidebarContent from "core/src/components/sidebar/SidebarContent.vue";

interface ProductRealFormProps {
  product: Product | null;
  productReal: ProductReal | null;
}

const { t } = useI18n();
const { toast } = useUI();
const productRealStore = useProductRealStore();
const emit = defineEmits(["cancel", "saved", "update:product"]);
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
  return product?.product_fields?.map((field: ProductField) => {
    const realFieldExist = productReal.product_real_fields?.find(
      (elem) => elem.idProductField == field.id
    );
    if (!isNil(realFieldExist)) {
      return realFieldExist;
    }

    return {
      idProductReal: productReal.id,
      idProductField: field.id,
    };
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
    let resProductReal: ProductReal = {};
    if (isNil(props.productReal)) {
      resProductReal = await productRealStore.create({
        idProduct: props.product?.id,
        ...data,
      });
      initProductRealInternal();
    } else if (!isNil(props.productReal.id)) {
      resProductReal = await productRealStore.update(props.productReal.id, {
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
    emit("saved", { data: resProductReal });
    loading.value = false;
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
