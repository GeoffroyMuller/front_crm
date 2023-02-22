<template>
  <Form
    :initial-value="{}"
    @submit="handleSubmit"
    @inputChange="handleInputChange"
  >
    <template #default="{ hasError, hasChanged }">
      <div class="form-sales">
        <Grid :gap="2" :columns="2">
          <MagicAutocomplete
            name="idCustomer"
            :label="$t('customer')"
            :getOptionLabel="(opt) => `${opt.firstname} ${opt.lastname}`"
            :rules="$yup.string().required()"
            optionKey="id"
            :get-filters="(str) => ({ $contains: { firstname: str } })"
            :store="clientStore"
          />
          <DatePicker name="date" :label="$t('date')" />
        </Grid>
        <Repetable
          :label="$t('pages.edit-sale.add-products')"
          name="form_product_lines"
        >
          <template #default="{ data: dataProduct }">
            <CheckoutProductLine :line="dataProduct"></CheckoutProductLine>
          </template>
          <template #actions="{ addSection }">
            <Button type="button" variant="text" @click="addSection()">
              {{ $t("pages.edit-sale.add-product") }}
            </Button>
          </template>
        </Repetable>
        <div>
          {{ $t("pages.edit-sale.total-price", { price: totalPrice }) }}
        </div>
        <div class="form-bottom">
          <Button
            type="submit"
            :icon="isNew ? 'add' : 'save'"
            :disabled="hasError || !hasChanged"
          >
            {{ isNew ? $t("create") : $t("save") }}
          </Button>
        </div>
      </div>
    </template>
  </Form>
</template>
<script setup lang="ts">
import Button from "core/src/components/Button.vue";
import DatePicker from "core/src/components/form/Datepicker/DatePicker.vue";
import Form from "core/src/components/form/Form.vue";
import Repetable from "core/src/components/form/repetable/Repetable.vue";
import Grid from "core/src/components/layouts/Grid.vue";
import MagicAutocomplete from "core/src/components/magic/MagicAutocomplete.vue";
import useUI from "core/src/composables/ui";
import useClientStore from "@/stores/clients";
import useSaleStore from "@/stores/quotes";
import type { ID } from "core/src/types";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import CheckoutProductLine from "./CheckoutProductLine.vue";

interface CheckoutProps {
  sale?: any;
}

const emit = defineEmits(["add", "update"]);
const props = withDefaults(defineProps<CheckoutProps>(), {
  sale: null,
});

const { toast } = useUI();
const { t } = useI18n();
const saleStore = useSaleStore();
const clientStore = useClientStore();

const isNew = computed(() => props.sale == null);

const saleDataForm = ref<any>(null);
const totalPrice = computed(() => {
  return 0;
});

function handleInputChange(data: any) {
  saleDataForm.value = data.formValue;
}

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
<style lang="scss">
.form-sales {
  @include grid(1, 0, 2);
}
.form-bottom {
  @include flex(row, flex-end, center, 2);
}
</style>
