<template>
  <Form :model-value="sale" @submit="handleSubmit">
    <template #default="{ hasError, hasChanged }">
      <div class="form-sales">
        <MagicAutocomplete
          name="idCustomer"
          :label="$t('customers')"
          :getOptionLabel="(opt) => `${opt.firstname} ${opt.lastname}`"
          :rules="$yup.string().required()"
          optionKey="id"
          :get-filters="(str) => ({ $contains: { firstname: str } })"
          :store="clientStore"
        />
      </div>
      <div class="actions">
        <Button
          type="submit"
          color="success"
          icon="add"
          :disabled="hasError || !hasChanged"
        >
          {{ isNew ? $t("add") : $t("save") }}
        </Button>
      </div>
    </template>
  </Form>
</template>
<script setup lang="ts">
import Button from "@/core/components/Button.vue";
import DataTable from "@/core/components/DataTable.vue";
import Form from "@/core/components/form/Form.vue";
import MagicAutocomplete from "@/core/components/magic/MagicAutocomplete.vue";
import useUI from "@/core/helpers/vue/composables/ui";
import useClientStore from "@/stores/clients";
import useSaleStore from "@/stores/sales";
import type { Product } from "@/types/product";
import type { Sale } from "@/types/sale";
import type { ID } from "@/types/utils";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";

interface SaleFormProps {
  sale: Sale | null;
}

const emit = defineEmits(["add", "update"]);
const props = withDefaults(defineProps<SaleFormProps>(), {
  sale: null,
});

const { toast } = useUI();
const { t } = useI18n();
const saleStore = useSaleStore();
const clientStore = useClientStore();

const isNew = computed(() => props.sale == null);

const saleProducts = ref<Array<Product>>(
  props.sale ? props.sale.products || [] : []
);

async function handleSubmit(data: any) {
  if (isNew.value) {
    try {
      const newSale = await saleStore.create(data);
      emit("add", newSale);
      toast({
        type: "success",
        message: t("success"),
      });
    } catch (error: any) {
      toast({
        type: "danger",
        message: error.response.data.message,
      });
    }
  } else {
    try {
      const id = (props.sale as Sale).id as ID;
      const saleRes = await saleStore.update(id, data);
      emit("update", { data: saleRes, id });
      toast({
        type: "success",
        message: t("success"),
      });
    } catch (error: any) {
      toast({
        type: "danger",
        message: error.response.data.message,
      });
    }
  }
}
</script>
<style lang="scss"></style>
