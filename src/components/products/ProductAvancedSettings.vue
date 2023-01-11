<template>
  <Form :model-value="product" @submit="handleSubmit">
    <template #default="{ hasError }">
      <div class="avanced-settings-product">
        <Repetable
          v-show="!isNumeraryStock"
          name="product_fields"
          :label="$t('fields')"
        >
          <template #default>
            <TextField name="name" :label="$t('name')" />
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
import Repetable from "@/core/components/form/repetable/Repetable.vue";

interface ProductAvancedSettingsProps {
  product: Product | null;
}

const emit = defineEmits(["saved", "cancel", "update:product"]);
const props = withDefaults(defineProps<ProductAvancedSettingsProps>(), {
  product: null,
});

const isNumeraryStock = ref<boolean>(
  props.product?.isNumeraryStock ? true : false
);

function handleSubmit(data: any) {
  const productRes = { ...props.product, product_fields: data.product_fields };
  emit("update:product", productRes);
  emit("saved", productRes);
}
</script>
<style lang="scss">
.avanced-settings-product {
  @include grid(1, 0, 2);
  .avanced-settings-bottom {
    @include flex(row, flex-end, center, 2);
  }
}
</style>
