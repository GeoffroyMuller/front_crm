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

function handleSubmit(data: any) {
  emit("saved", data.product_fields);
}
</script>
<style lang="scss">
.avanced-settings-product {
  @apply grid grid-cols-1 gap-4;
  .product_field {
    @apply grid grid-cols-2 gap-2;
  }
  .avanced-settings-bottom {
    @apply flex justify-end items-center gap-4;
  }
}
</style>
