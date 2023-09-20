<template>
  <Card padding>
    <Form shortcuts :initial-value="productInternal" @submit="handleSubmit">
      <template #default="{ hasError, hasChanged }">
        <div class="avanced-settings-product">
          <Repetable name="product_fields" :label="$t('fields')">
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
                  v-if="data.type == 'select'"
                  :rules="$yup.array().min(1)"
                  :label="$t('pages.edit-product.add-selectable-options')"
                  name="props"
                  :min="1"
                >
                  <template #default>
                    <TextField
                      :rules="$yup.string().required()"
                      name="option"
                      :label="$t('value')"
                    />
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
              v-tooltip="{
                text: $t('keyboardshortcuts.ctrl+s'),
                placement: 'bottom',
              }"
              >{{ $t("save") }}</Button
            >
          </div>
        </div>
      </template>
    </Form>
  </Card>
</template>
<script setup lang="ts">
import Button from "core/src/components/Button.vue";
import Card from "core/src/components/card/Card.vue";
import Form from "core/src/components/form/Form.vue";
import Repetable from "core/src/components/form/repetable/Repetable.vue";
import Select from "core/src/components/form/Select.vue";
import TextField from "core/src/components/form/TextField.vue";
import useProductsStore from "@/modules/products/stores/products";
import type { Product, ProductField } from "@/types/product";
import { isNil } from "lodash";
import { computed } from "vue";

interface ProductAvancedSettingsStockProps {
  product: Product | null;
  loading: boolean;
}
interface IFieldOption {
  label: string;
  value: string;
}
const productStore = useProductsStore();
const emit = defineEmits(["saved", "cancel"]);
const props = withDefaults(defineProps<ProductAvancedSettingsStockProps>(), {
  product: null,
});

const productInternal = computed(() => {
  return {
    ...props.product,
    product_fields: props?.product?.product_fields?.map((field: any) => {
      return {
        ...field,
        props: field?.props?.options?.map((elem: any) => {
          return { option: elem?.value };
        }),
      };
    }),
  };
});

function _mapProductFields(formDataProductFields: any): Array<ProductField> {
  return formDataProductFields.reduce(
    (accumulator: Array<ProductField>, field: any) => {
      if (!isNil(field)) {
        accumulator.push({
          ...field,
          props: {
            options: field?.props?.reduce(
              (accumulator: Array<IFieldOption>, elem: any) => {
                if (
                  !isNil(elem) &&
                  // eslint-disable-next-line no-prototype-builtins
                  elem?.hasOwnProperty("option") &&
                  !isNil(elem?.option) &&
                  elem?.option != ""
                ) {
                  accumulator.push({
                    label: elem.option,
                    value: elem.option,
                  });
                }
                return accumulator;
              },
              []
            ),
          },
        });
      }
      return accumulator;
    },
    []
  );
}

function handleSubmit(data: any) {
  const productRes = {
    ...props.product,
    product_fields: _mapProductFields(data.product_fields),
  };
  emit("saved", productRes);
}
</script>
<style lang="scss">
.avanced-settings-product {
  @include grid(1, 0, 2);
  .product_field {
    @include grid(2, 0, 1);
  }
  .avanced-settings-bottom {
    @include flex(row, flex-end, center, 2);
  }
}
</style>
