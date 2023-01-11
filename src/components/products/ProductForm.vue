<template>
  <Form :model-value="product" @submit="handleSubmit">
    <template #default="{ hasError }">
      <div class="form-product">
        <div class="form-head">
          <TextField name="name" :label="$t('name')" />
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
          <Switch
            name="isNumeraryStock"
            v-model="isNumeraryStock"
            :label="$t('pages.edit-product.stored-numerary')"
          />
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
import type { Product } from "@/types/product";
import { ref } from "vue";
import Switch from "@/core/components/form/Switch.vue";

interface ProductFormProps {
  product: Product | null;
}
const emit = defineEmits(["saved", "cancel", "update:product"]);
const props = withDefaults(defineProps<ProductFormProps>(), {
  product: null,
});

const isNumeraryStock = ref<boolean>(
  props.product?.isNumeraryStock ? true : false
);

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
