<template>
  <Form :model-value="saleDataForm" @submit="handleSubmit">
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

        <Repetable
          :label="$t('pages.edit-sale.add-products')"
          name="form_product_lines"
        >
          <template #default="{ data: dataProduct }">
            <SaleProductLine :line="dataProduct"></SaleProductLine>
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
import Button from "@/core/components/Button.vue";
import Form from "@/core/components/form/Form.vue";
import Repetable from "@/core/components/form/repetable/Repetable.vue";
import MagicAutocomplete from "@/core/components/magic/MagicAutocomplete.vue";
import useUI from "@/core/helpers/vue/composables/ui";
import useClientStore from "@/stores/clients";
import useSaleStore from "@/stores/sales";
import type {
  Sale,
  SaleForm,
  SaleFormProductLine,
  SaleFormProductRealLine,
  SaleProductLineType,
  SaleProductRealLineType,
} from "@/types/sale";
import type { ID } from "@/types/utils";
import { isNil } from "lodash";
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import SaleProductLine from "./SaleProductLine.vue";

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

const totalPrice = computed(() => 10.0); //TODO

const saleDataForm = ref<SaleForm | null>(null);

onMounted(() => {
  if (!isNil(props.sale)) {
    saleDataForm.value = _mapSaleToDataForm(props.sale);
  }
});

function _mapSaleToDataForm(data: Sale): SaleForm {
  return {
    idCustomer: data?.idCustomer,
    form_product_lines: data?.product_lines?.reduce(
      (
        accumulator: Array<SaleFormProductLine>,
        saleProduct: SaleProductLineType
      ) => {
        if (!isNil(saleProduct)) {
          accumulator.push({
            price: saleProduct.saleProductPrice,
            product: saleProduct,
            quantity: saleProduct.quantity,
            form_product_real_lines: data?.product_real_lines?.reduce(
              (
                acc: Array<SaleFormProductRealLine>,
                saleProductReal: SaleProductRealLineType
              ) => {
                if (!isNil(saleProductReal)) {
                  acc.push({
                    price: saleProductReal.saleProductRealPrice,
                    product_real: saleProductReal,
                  } as SaleFormProductRealLine);
                }
                return acc;
              },
              []
            ),
          } as SaleFormProductLine);
        }
        return accumulator;
      },
      []
    ),
  };
}
function _mapDataFormToProductRealLines(
  productRealLinesForm: Array<SaleFormProductRealLine> | null | undefined
): Array<SaleProductRealLineType> {
  if (isNil(productRealLinesForm)) {
    return [];
  }
  return productRealLinesForm?.reduce(
    (
      acc: Array<SaleProductRealLineType>,
      product_real_line: SaleFormProductRealLine
    ) => {
      if (
        !isNil(product_real_line) &&
        !isNil(product_real_line?.idProductReal)
      ) {
        acc.push({
          idProductReal: product_real_line.idProductReal,
          saleProductRealPrice: product_real_line.price,
        });
      }
      return acc;
    },
    []
  );
}
function _mapDataFormToSale(data: SaleForm): Sale {
  const saleLines = data.form_product_lines?.reduce(
    (accumulator: any, product_line: SaleFormProductLine) => {
      if (!isNil(product_line)) {
        accumulator.product_lines.push({
          ...product_line,
          saleProductPrice: product_line.price,
          quantity: product_line.quantity,
        } as SaleProductLineType);

        if (!isNil(product_line.form_product_real_lines)) {
          const product_real_lines = _mapDataFormToProductRealLines(
            product_line.form_product_real_lines
          );
          console.error({ product_real_lines });
          accumulator.product_real_lines = [
            ...accumulator.product_real_lines,
            ...product_real_lines,
          ];
        }
      }
      return accumulator;
    },
    { product_lines: [], product_real_lines: [] }
  );
  return {
    idCustomer: data.idCustomer,
    ...saleLines,
  };
}

async function handleSubmit(data: any) {
  const dataMapped = _mapDataFormToSale(data);
  console.error({ dataMapped });
  if (isNew.value) {
    try {
      const newSale = await saleStore.create(dataMapped);
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
      const saleRes = await saleStore.update(id, dataMapped);
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
