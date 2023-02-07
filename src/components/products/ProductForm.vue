<template>
  <Form shortcuts :model-value="product" @submit="handleSubmit">
    <template #default="{ hasError, hasChanged }">
      <div class="form-product">
        <div class="form-head">
          <TextField
            name="name"
            :label="$t('name')"
            :rules="$yup.string().required()"
          />
        </div>
        <TextField
          name="price"
          :label="$t('price')"
          :step="0.01"
          type="number"
        />
        <TextField
          name="description"
          :label="$t('pages.edit-product.description')"
          :multiline="true"
        />
        <div class="form-stock">
          <RadioGroup
            name="stockManagement"
            v-model="stockManagement"
            :label="$t('pages.edit-product.stock-management')"
            :options="[
              { label: $t('none'), value: null },
              { label: $t('numerary'), value: 'numerary' },
              { label: $t('physical'), value: 'physical' },
            ]"
            :getOptionLabel="(opt) => opt.label"
            :getOptionValue="(opt) => opt.value"
          >
          </RadioGroup>
          <KeepAlive>
            <TextField
              v-if="isNumeraryStock"
              name="stock"
              :min="0"
              :label="$t('quantity')"
              type="number"
            />
          </KeepAlive>
        </div>
        <div class="form-bottom">
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
</template>
<script setup lang="ts">
import Form from "@/core/components/form/Form.vue";
import Button from "@/core/components/Button.vue";
import TextField from "@/core/components/form/TextField.vue";
import type { Product, StockManagement } from "@/types/product";
import { computed, ref } from "vue";
import RadioGroup from "@/core/components/form/RadioGroup.vue";

interface ProductFormProps {
  product: Product | null;
}
const emit = defineEmits(["saved"]);
const props = withDefaults(defineProps<ProductFormProps>(), {
  product: null,
});
const loading = ref<boolean>(false);
const stockManagement = ref<StockManagement>(
  props.product?.stockManagement || null
);

const isNumeraryStock = computed(() => {
  return stockManagement.value == "numerary";
});

function handleSubmit(data: any) {
  loading.value = true;
  emit(
    "saved",
    data,
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
.form-product {
  @include grid(1, 0, 2);
  .form-head {
    @include grid(1, 0, 2);
  }
  .form-stock {
    @include grid(1, 0, 2);
  }
  .form-bottom {
    @include flex(row, flex-end, center, 2);
  }
}
</style>
