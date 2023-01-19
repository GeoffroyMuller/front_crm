<template>
  <Form :model-value="productInternal" @submit="handleSubmit">
    <template #default="{ hasError, hasChanged }">
      <div class="avanced-settings-product">
        <Repetable
          v-show="!isNumeraryStock"
          name="product_fields"
          :label="$t('fields')"
        >
          <template #default="{ data }">
            <div class="product_field">
              <TextField
                :rules="$yup.string().required()"
                name="name"
                :label="$t('name')"
              />
              <Select
                :rules="$yup.string().required()"
                :options="[
                  { label: $t('text'), value: 'string' },
                  { label: $t('number'), value: 'number' },
                  { label: $t('selector'), value: 'select' },
                ]"
                :label="$t('type')"
                :get-option-label="(opt) => opt.label"
                :get-option-value="(opt) => opt.value"
                name="type"
              />
              <Repetable
                v-show="data.type == 'select'"
                :rules="$yup.array().min(1)"
                :label="$t('pages.edit-product.add-selectable-options')"
                name="props"
                :min="1"
              >
                <template #default>
                  <TextField name="option" :label="$t('value')" />
                </template>
              </Repetable>
            </div>
          </template>
          <template #actions="{ addSection }">
            <Button type="button" variant="text" @click="addSection()">
              {{ $t("add") }}
            </Button>
          </template>
        </Repetable>
        <div class="avanced-settings-bottom">
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
import type { Product, ProductField } from "@/types/product";
import { computed, ref } from "vue";
import Repetable from "@/core/components/form/repetable/Repetable.vue";
import useProductsStore from "@/stores/products";
import Select from "@/core/components/form/Select.vue";

interface ProductAvancedSettingsProps {
  product: Product | null;
}
const productStore = useProductsStore();
const emit = defineEmits(["saved", "cancel"]);
const props = withDefaults(defineProps<ProductAvancedSettingsProps>(), {
  product: null,
});

const loading = ref<boolean>(false);
const isNumeraryStock = ref<boolean>(
  productStore.isNumeraryStock(props.product)
);

const productInternal = computed(() => {
  return {
    ...props.product,
    product_fields: props?.product?.product_fields?.map((field: any) => {
      return {
        ...field,
        props: field?.props?.options?.map((elem: any) => {
          return { option: elem.value };
        }),
      };
    }),
  };
});

function handleSubmit(data: any) {
  loading.value = true;
  const productRes = {
    ...props.product,
    product_fields: data.product_fields.map((field: any) => {
      return {
        ...field,
        props: {
          options: field?.props?.map((elem: any) => {
            return { label: elem.option, value: elem.option };
          }),
        },
      };
    }),
  };
  /* */
  emit(
    "saved",
    productRes,
    () => {
      loading.value = false;
    },
    () => {
      loading.value = false;
    }
  );
}
</script>
<style lang="scss">
.avanced-settings-product {
  @include grid(1, 0, 2);
  .product_field {
    @include grid(2, 0, 2);
  }
  .avanced-settings-bottom {
    @include flex(row, flex-end, center, 2);
  }
}
</style>
