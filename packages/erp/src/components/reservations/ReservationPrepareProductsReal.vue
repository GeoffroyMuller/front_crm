<template>
  <div class="reservation-prepare-products-real">
    <Grid :gap="2" :columns="1">
      <SubForm v-model="internalReservation">
        <Repetable name="lines">
          <template #default="{ data: line }">
            <Card
              >{{ line.product?.name }}
              <Repetable
                v-if="
                  line &&
                  productStore.isPhysicalStock(line.product) &&
                  line.product
                "
                v-model="line.sublines"
                name="sublines"
              >
                <template #default="{ data }">
                  <ReservationProductRealLine
                    :product="data?.product"
                  ></ReservationProductRealLine>
                </template>
                <template #actions="{ addSection }">
                  <Button
                    type="button"
                    variant="text"
                    @click.stop="addSection()"
                  >
                    {{ $t("pages.edit-reservation.add-product-real") }}
                  </Button>
                </template>
              </Repetable>
            </Card>
          </template>
        </Repetable>
      </SubForm>
      <!-- <Repetable
        v-if="productStore.isPhysicalStock(product) && product"
        name="sublines"
      >
        <template #default>
          <ReservationProductRealLine
            :product="line?.product"
          ></ReservationProductRealLine>
        </template>
        <template #actions="{ addSection }">
          <Button type="button" variant="text" @click="addSection()">
            {{ $t("pages.edit-reservation.add-product-real") }}
          </Button>
        </template>
      </Repetable> -->
    </Grid>
  </div>
</template>
<script setup lang="ts">
import Button from "core/src/components/Button.vue";
import Repetable from "core/src/components/form/repetable/Repetable.vue";
import Grid from "core/src/components/layouts/Grid.vue";
import MagicAutocomplete from "core/src/components/magic/MagicAutocomplete.vue";
import useProductsStore from "@/stores/products";
import type { Product } from "@/types/product";
import type { SaleLine, SaleSubline } from "@/types/sale";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import ReservationProductRealLine from "./ReservationProductRealLine.vue";
import TextField from "core/src/components/form/TextField.vue";
import Card from "core/src/components/Card.vue";
import type { Reservation } from "@/types/reservation";
import SubForm from "core/src/components/form/subform.vue";

const { t } = useI18n();
const productStore = useProductsStore();

const emit = defineEmits(["update:reservation"]);

interface ReservationPrepareProductsRealProps {
  reservation: Reservation | null;
}
const props = withDefaults(
  defineProps<ReservationPrepareProductsRealProps>(),
  {}
);
const internalReservation = computed({
  get() {
    return {
      ...props.reservation,
      lines: props.reservation?.lines?.filter((l) =>
        productStore.isPhysicalStock(l.product)
      ),
    };
  },
  set(val) {
    emit("update:reservation", {
      ...props.reservation,
      lines: [
        ...(props.reservation?.lines || []).filter(
          (l) => !productStore.isPhysicalStock(l.product)
        ),
        ...(internalReservation.value.lines || []),
      ],
    });
  },
});
</script>
<style lang="scss"></style>
