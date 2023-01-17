<template>
  <Form :model-value="product" @submit="handleSubmit">
    <template #default="{ hasError, hasChanged }">
      <pre class="code">{{ hasChanged }}</pre>

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
            :rules="$yup.string().nullable().required()"
            name="stockManagement"
            v-model="stockManagement"
            :label="$t('pages.edit-product.stock-management')"
            :options="[
              { label: $t('none'), value: 'none' },
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
import type { Product, StockManagement } from "@/types/product";
import { computed, ref } from "vue";
import Switch from "@/core/components/form/Switch.vue";
import RadioGroup from "@/core/components/form/RadioGroup.vue";

interface ProductFormProps {
  product: Product | null;
}
const emit = defineEmits(["saved", "cancel", "update:product"]);
const props = withDefaults(defineProps<ProductFormProps>(), {
  product: null,
});

const stockManagement = ref<StockManagement>(
  props.product?.stockManagement || null
);

const isNumeraryStock = computed(() => {
  return stockManagement.value == "numerary";
});

function handleSubmit(data: any) {
  emit("update:product", data);
  emit("saved", data);
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
