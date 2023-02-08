<template>
  <Form shortcuts :model-value="product" @submit="handleSubmit">
    <template #default="{ hasError, hasChanged }">
      <div class="avanced-settings-product-event">
        <div class="avanced-settings-event-bottom">
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
</template>
<script setup lang="ts">
import Button from "@/core/components/Button.vue";
import Form from "@/core/components/form/Form.vue";
import Repetable from "@/core/components/form/repetable/Repetable.vue";
import Select from "@/core/components/form/Select.vue";
import TextField from "@/core/components/form/TextField.vue";
import useProductsStore from "@/stores/products";
import type { Product } from "@/types/product";

interface ProductAvancedSettingsEventProps {
  product: Product | null;
  loading: boolean;
}

const productStore = useProductsStore();
const emit = defineEmits(["saved", "cancel"]);
const props = withDefaults(defineProps<ProductAvancedSettingsEventProps>(), {
  product: null,
});

function handleSubmit(data: any) {
  emit("saved", data);
}
</script>

<style lang="scss">
.avanced-settings-product-event {
  @include grid(1, 0, 2);
  .product_field {
    @include grid(2, 0, 2);
  }
  .avanced-settings-event-bottom {
    @include flex(row, flex-end, center, 2);
  }
}
</style>
