<template>
  <Form :model-value="product" @submit="handleSubmit">
    <template #default="{ hasError }">
      <div class="form-product">
        <TextField name="name" :label="$t('name')" />
        <TextField
          name="description"
          :label="$t('pages.edit-product.description')"
          :multiline="true"
        />
        <TextField name="price" :label="$t('price')" type="number" />
        <div>
          <Button :disabled="hasError" type="submit">{{ $t("save") }}</Button>
        </div>
      </div>
    </template>
  </Form>
</template>
<script setup lang="ts">
import Form from "@/core/components/form/Form.vue";
import Button from "@/core/components/Button.vue";
import useProductStore from "@/stores/products";
import TextField from "@/core/components/form/TextField.vue";
import type { Product } from "@/types/product";
import { ref } from "vue";
import { isNil } from "lodash";

const productsStore = useProductStore();

interface ProductFormProps {
  product: Product | null;
}
const emit = defineEmits(["saved"]);
const props = withDefaults(defineProps<ProductFormProps>(), {
  product: null,
});

async function handleSubmit(data: any) {
  try {
    if (isNil(props.product)) {
      await productsStore.create(data);
    } else {
      await productsStore.update(props.product.id, data);
    }
    emit("saved");
  } catch (error) {
    console.error(error);
  }
}
</script>
<style lang="scss">
.form-product {
  @include grid(1, 0, 2);
}
</style>
