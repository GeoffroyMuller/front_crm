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
      <SubForm v-model="internalReservation">
        <Repetable
          name="lines"
          :min="internalReservation.lines?.length"
          :max="internalReservation.lines?.length"
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
        <Button type="button" variant="text" @click.stop="$emit('saved')">
          {{ $t("saved") }}
        </Button>
      </SubForm>
    </Grid>
  </div>
</template>
<script setup lang="ts">
import Button from "core/src/components/Button.vue";
import Repetable from "core/src/components/form/repetable/Repetable.vue";
import Grid from "core/src/components/layouts/Grid.vue";
import useProductsStore from "@/stores/products";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import ReservationProductRealLine from "./ReservationProductRealLine.vue";
import type { Reservation } from "@/types/reservation";
import SubForm from "core/src/components/form/subform.vue";
import { isEqual } from "lodash";

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
    if (
      !isEqual(
        val.lines,
        props.reservation?.lines?.filter((l) =>
          productStore.isPhysicalStock(l.product)
        )
      )
    ) {
      emit("update:reservation", {
        ...props.reservation,
        lines: [
          ...(props.reservation?.lines || []).filter(
            (l) => !productStore.isPhysicalStock(l.product)
          ),
          ...(internalReservation.value.lines || []),
        ],
      });
    }
  },
});
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
