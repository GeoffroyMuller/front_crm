<template>
  <Form shortcuts :model-value="product" @submit="handleSubmit">
    <template #default="{ hasError, hasChanged, value }">
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
        <Select
          class="input"
          :options="vats"
          :get-option-label="
            (opt: Vat) => (opt?.rate != null ? `${opt?.rate}%` : '')
          "
          :get-option-value="(opt: Vat) => opt.id"
          :label="$t('vat')"
          name="idVat"
        />
        <HtmlEditor
          name="description"
          :label="$t('pages.edit-product.description')"
        />
        <Flex :gap="2">
          <div :style="{ width: '150px' }" v-if="product == null">
            <Switch
              :label="$t('pages.edit-product.event-product')"
              name="isEvent"
            />
          </div>
          <div :style="{ maxWidth: '500px' }">
            <TextField
              v-if="value.isEvent || product?.stockManagement == 'events'"
              :label="$t('pages.edit-product.capacity')"
              name="capacity"
              type="number"
            />
          </div>
        </Flex>
        <div class="form-stock" v-if="product == null">
          <RadioGroup
            v-if="!value.isEvent"
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
import useVatStore from "@/stores/vat";
import type { Vat } from "@/types/vat";
import Select from "@/core/components/form/Select.vue";
import HtmlEditor from "@/core/components/HtmlEditor.vue";
import Switch from "@/core/components/form/Switch.vue";
import Flex from "@/core/components/layouts/Flex.vue";

interface ProductFormProps {
  product: Product | null;
  loading: boolean;
}
const emit = defineEmits(["saved"]);
const props = withDefaults(defineProps<ProductFormProps>(), {
  product: null,
});

const vatStore = useVatStore();

const vats = computed(() => vatStore.getList);

const stockManagement = ref<StockManagement>(
  props.product?.stockManagement || null
);

const isNumeraryStock = computed(() => {
  return stockManagement.value == "numerary";
});

async function handleSubmit(data: any) {
  if (data.isEvent) {
    data.stockManagement = "events";
  }
  delete data.isEvent;
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
