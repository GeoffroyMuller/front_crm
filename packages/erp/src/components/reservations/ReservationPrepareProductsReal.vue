<template>
  <div class="reservation-prepare-products-real">
    <div class="title">
      {{ $t("pages.edit-reservation.prepare-the-products") }}
    </div>
    <div class="reservation-btn-back">
      <Button @click.stop="$emit('back')" variant="text" icon="chevron_left">
        {{ $t("back") }}
      </Button>
    </div>
    <Grid :gap="2" :columns="1">
      <Form v-model="internalReservation" @submit="handleSubmit">
        <Repetable
          name="lines"
          :min="internalReservation?.lines?.length"
          :max="internalReservation?.lines?.length"
        >
          <template #default="{ data: line }">
            <Repetable
              v-model="line.sublines"
              :label="`${line.product?.name}`"
              name="sublines"
            >
              <template #default>
                <ReservationProductRealLine
                  :product="line?.product"
                ></ReservationProductRealLine>
              </template>
              <template #actions="{ addSection }">
                <Button type="button" variant="text" @click.stop="addSection()">
                  {{ $t("pages.edit-reservation.add-product-real") }}
                </Button>
              </template>
            </Repetable>
          </template>
        </Repetable>
        <Flex :mt="2" justify-content="flex-end">
          <Button type="submit">
            {{ $t("save") }}
          </Button>
        </Flex>
      </Form>
    </Grid>
  </div>
</template>
<script setup lang="ts">
import Button from "core/src/components/Button.vue";
import Repetable from "core/src/components/form/repetable/Repetable.vue";
import Grid from "core/src/components/layouts/Grid.vue";
import useProductsStore from "@/stores/products";
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import ReservationProductRealLine from "./ReservationProductRealLine.vue";
import type { Reservation } from "@/types/reservation";
import SubForm from "core/src/components/form/subform.vue";
import { isEqual, isNil } from "lodash";
import Flex from "core/src/components/layouts/Flex.vue";
import Form from "core/src/components/form/Form.vue";
import type { SaleLine, SaleSubline } from "@/types/sale";

const { t } = useI18n();
const productStore = useProductsStore();

const emit = defineEmits(["update:reservation", "saved"]);

interface ReservationPrepareProductsRealProps {
  reservation: Reservation | null;
}
const props = withDefaults(
  defineProps<ReservationPrepareProductsRealProps>(),
  {}
);
const internalReservation = ref<Reservation | null>(null);
watch(
  () => props.reservation,
  (val) => {
    if (!val) return;
    internalReservation.value = {
      ...val,
      lines: mapLines(
        val?.lines?.filter((l) => productStore.isPhysicalStock(l.product))
      ),
    };
  },
  { immediate: true }
);

function mapLines(lines: any): Array<SaleLine> {
  return lines?.map((line: SaleLine) => {
    const resSublines = line.sublines?.reduce(
      (acc: Array<SaleSubline>, subline: SaleSubline) => {
        if (Object.keys(subline).length > 0 && !isNil(subline.idProductReal)) {
          acc.push(subline);
        }
        return acc;
      },
      []
    );
    return { ...line, sublines: resSublines } as SaleLine;
  });
}

function handleSubmit(data: any) {
  if (
    !isEqual(
      data.lines,
      props.reservation?.lines?.filter((l) =>
        productStore.isPhysicalStock(l.product)
      )
    )
  ) {
    const res = {
      ...props.reservation,
      lines: [
        ...(props.reservation?.lines || []).filter(
          (l) => !productStore.isPhysicalStock(l.product)
        ),
        ...(mapLines(internalReservation.value?.lines) || []),
      ],
    };
    emit("saved", res);
  }
}
</script>
<style lang="scss">
.reservation-prepare-products-real {
  padding: spacing(2);
  .title {
    margin-bottom: spacing(1) !important;
  }
  .reservation-btn-back {
    margin-bottom: spacing(2);
  }
}
</style>
