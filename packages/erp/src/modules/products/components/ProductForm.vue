<template>
  <Form shortcuts :initial-value="product" @submit="handleSubmit">
    <template #default="{ hasError, hasChanged, value }">
      <div class="grid gap-4">
        <TextField
          name="name"
          :label="$t('name')"
          :rules="$yup.string().required()"
        />

        <div class="grid grid-cols-2 gap-2">
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
        </div>

        <Wysiwyg
          name="description"
          :label="$t('pages.edit-product.description')"
        />
        <Flex
          :gap="2"
          v-if="
            product == null ||
            productsStore.isEventStock(product) ||
            value.isEvent
          "
        >
          <div :style="{ width: '150px' }" v-if="product == null">
            <Switch
              :label="$t('pages.edit-product.event-product')"
              name="isEvent"
            />
          </div>
          <div :style="{ maxWidth: '500px' }">
            <TextField
              v-if="value.isEvent || productsStore.isEventStock(product)"
              :label="$t('pages.edit-product.capacity')"
              name="capacity"
              type="number"
            />
          </div>
        </Flex>
        <div class="form-stock">
          <RadioGroup
            v-if="product == null && !value.isEvent"
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
        <slot name="end" />
      </div>
    </template>
  </Form>
</template>
<script setup lang="ts">
import Form from "core/src/components/form/Form.vue";
import TextField from "core/src/components/form/TextField.vue";
import type { Product, StockManagement } from "@/types/product";
import { computed, ref } from "vue";
import RadioGroup from "core/src/components/form/RadioGroup.vue";
import useVatStore from "@/stores/vat";
import type { Vat } from "@/types/vat";
import Select from "core/src/components/form/Select.vue";
import Switch from "core/src/components/form/Switch.vue";
import Flex from "core/src/components/layouts/Flex.vue";
import useProductsStore from "@/stores/products";
import Wysiwyg from "core/src/components/form/Wysiwyg.vue";

interface ProductFormProps {
  product: Product | null;
  loading: boolean;
}
const emit = defineEmits(["saved"]);
const props = withDefaults(defineProps<ProductFormProps>(), {
  product: null,
});

const vatStore = useVatStore();
const productsStore = useProductsStore();

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