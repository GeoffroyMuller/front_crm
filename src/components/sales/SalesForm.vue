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

        <Repetable
          :label="$t('pages.edit-sale.add-products')"
          name="form_product_lines"
        >
          <template #default="{ data: dataProduct }">
            <Grid :gap="2" :columns="1">
              <Grid :gap="2" :columns="2">
                <MagicAutocomplete
                  name="product"
                  :label="$t('product')"
                  :getOptionLabel="displayProductAutocomplete"
                  :get-filters="
                    (str) => ({ $or: { $contains: { name: str, price: str } } })
                  "
                  :store="productStore"
                />
                <template v-if="dataProduct.product">
                  <Grid :gap="2" :columns="2">
                    <TextField
                      v-if="!productStore.isPhysicalStock(dataProduct.product)"
                      :rules="$yup.string().required()"
                      :model-value="dataProduct.product?.price"
                      type="number"
                      :step="0.01"
                      name="price"
                      :label="$t('unit-price')"
                    />
                    <TextField
                      v-if="!productStore.isPhysicalStock(dataProduct.product)"
                      :rules="$yup.string().required()"
                      :model-value="1"
                      :min="1"
                      type="number"
                      :step="1"
                      name="quantity"
                      :label="$t('quantity')"
                    />
                  </Grid>
                </template>
              </Grid>
              <Repetable
                v-if="productStore.isPhysicalStock(dataProduct.product)"
                name="form_product_real_lines"
              >
                <template #default>
                  <Grid :gap="2" :columns="2">
                    <MagicAutocomplete
                      name="product_real"
                      :label="$t('reference')"
                      :getOptionLabel="displayProductRealAutocomplete"
                      :get-filters="
                        (str) => ({
                          $contains: {
                            reference: str,
                            idProduct: dataProduct.product.id,
                          },
                        })
                      "
                      :store="productRealStore"
                    />
                    <Grid :gap="2" :columns="2">
                      <TextField
                        :rules="$yup.string().required()"
                        :model-value="dataProduct.product?.price"
                        type="number"
                        :step="0.01"
                        name="price"
                        :label="$t('unit-price')"
                      />
                    </Grid>
                  </Grid>
                </template>
              </Repetable>
            </Grid>
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
import TextField from "@/core/components/form/TextField.vue";
import Grid from "@/core/components/layouts/Grid.vue";
import MagicAutocomplete from "@/core/components/magic/MagicAutocomplete.vue";
import useUI from "@/core/helpers/vue/composables/ui";
import useClientStore from "@/stores/clients";
import useProductsStore from "@/stores/products";
import useProductsRealStore from "@/stores/products_real";
import useSaleStore from "@/stores/sales";
import type { Product, ProductReal } from "@/types/product";
import type {
  Sale,
  SaleForm,
  SaleFormProductLine,
  SaleFormProductRealLine,
  SaleProductLine,
  SaleProductRealLine,
} from "@/types/sale";
import { isNil } from "lodash";
import { computed } from "vue";
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
const productStore = useProductsStore();
const productRealStore = useProductsRealStore();

const isNew = computed(() => props.sale == null);

const totalPrice = computed(() => 10.0); //TODO

function displayProductAutocomplete(product: Product): string {
  return `${product.name} ${"| " + t("price") + " : " + product.price} ${
    productStore.isNumeraryStock(product)
      ? "| " + t("stock") + " : " + product.stock
      : ""
  }`;
}
function displayProductRealAutocomplete(productReal: ProductReal) {
  return `${productReal.reference}`;
}
function _mapDataFormToProductRealLines(
  productRealLinesForm: Array<SaleFormProductRealLine> | null | undefined
): Array<SaleProductRealLine> {
  if (isNil(productRealLinesForm)) {
    return [];
  }
  return productRealLinesForm?.reduce(
    (
      acc: Array<SaleProductRealLine>,
      product_real_line: SaleFormProductRealLine
    ) => {
      if (!isNil(product_real_line)) {
        acc.push({
          ...product_real_line.product_real,
          saleProductPrice: product_real_line.price,
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
          ...product_line.product,
          saleProductPrice: product_line.price,
          quantity: product_line.quantity,
        } as SaleProductLine);

        if (productStore.isPhysicalStock(product_line.product)) {
          const product_real_lines = _mapDataFormToProductRealLines(
            product_line.form_product_real_lines
          );
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
} //TODO

async function handleSubmit(data: any) {
  const dataMapped = _mapDataFormToSale(data);
  console.error({ dataMapped });
  /*   if (isNew.value) {
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
  } */
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
