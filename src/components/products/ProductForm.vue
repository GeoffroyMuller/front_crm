<template>
  <Form :model-value="product" @submit="handleSubmit">
    <template #default="{ hasError }">
      <div class="form-product">
        <div class="form-head">
          <TextField name="name" :label="$t('name')" />
        </div>
        <TextField name="price" :label="$t('price')" type="number" />
        <TextField
          name="description"
          :label="$t('pages.edit-product.description')"
          :multiline="true"
        />
        <div class="form-stock">
          <Switch
            name="isNumeraryStock"
            v-model="isNumeraryStock"
            :label="$t('stored-numerary')"
          />
          <TextField
            :disabled="!(isNumeraryStock == true)"
            name="stock"
            :label="$t('quantity')"
            type="number"
          />
        </div>
        <Repetable name="product_fields" :label="$t('fields')">
          <template #default>
            <TextField name="name" :label="$t('name')" />
          </template>
          <template #actions="{ addSection }">
            <Button type="button" variant="text" @click="addSection()">
              {{ $t("add") }}
            </Button>
          </template>
        </Repetable>
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
import useProductStore from "@/stores/products";
import TextField from "@/core/components/form/TextField.vue";
import type { Product } from "@/types/product";
import { ref } from "vue";
import { isNil } from "lodash";
import Switch from "@/core/components/form/Switch.vue";
import Repetable from "@/core/components/form/repetable/Repetable.vue";

const productsStore = useProductStore();

interface ProductFormProps {
  product: Product | null;
}
const emit = defineEmits(["saved", "cancel"]);
const props = withDefaults(defineProps<ProductFormProps>(), {
  product: null,
});

const isNumeraryStock = ref<boolean>(
  props.product?.isNumeraryStock ? true : false
);

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
