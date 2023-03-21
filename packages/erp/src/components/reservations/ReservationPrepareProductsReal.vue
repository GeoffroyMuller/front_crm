<template>
  <div class="reservation-prepare-products-real">
    <div class="typo-title">
      {{ $t("pages.edit-reservation.prepare-the-products") }}
    </div>
    <div class="reservation-btn-back">
      <Button
        @click.stop="$emit('back')"
        :disabled="loading"
        variant="text"
        icon="chevron_left"
      >
        {{ $t("back") }}
      </Button>
    </div>
    <Grid :gap="2" :columns="1">
      <Form v-model="internalReservation" @submit="handleSubmit">
        <template #default="{ hasError, hasChanged }">
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
                  <Button
                    type="button"
                    variant="text"
                    @click.stop="addSection()"
                  >
                    {{ $t("pages.edit-reservation.add-product-real") }}
                  </Button>
                </template>
              </Repetable>
            </template>
          </Repetable>
          <Flex :mt="2" justify-content="flex-end">
            <Button
              type="submit"
              :disabled="hasError || !hasChanged"
              :loading="loading"
            >
              {{ $t("save") }}
            </Button>
          </Flex>
        </template>
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
import useReservationStore from "@/stores/reservations";
import useUI from "core/src/composables/ui";

const { t } = useI18n();
const { toast } = useUI();
const productStore = useProductsStore();
const reservationStore = useReservationStore();

const emit = defineEmits(["saved"]);

interface ReservationPrepareProductsRealProps {
  reservation: Reservation | null;
}
const props = withDefaults(
  defineProps<ReservationPrepareProductsRealProps>(),
  {}
);
const internalReservation = ref<Reservation | null>(null);
const loading = ref<boolean>(false);
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

async function handleSubmit(
  data: any,
  { hasChanged }: { hasChanged: boolean }
) {
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
    } as Reservation;
    if (props.reservation != null && hasChanged) {
      try {
        loading.value = true;
        const response = await reservationStore.update(
          props.reservation.id,
          res
        );
        loading.value = false;
        emit("saved", response);
        toast({
          type: "success",
          message: t("saved"),
        });
      } catch (error: any) {
        loading.value = false;
        toast({
          type: "danger",
          message: error.response.data.message,
        });
      }
    }
  }
}
</script>
<style lang="scss">
.reservation-prepare-products-real {
  .reservation-btn-back {
    margin-bottom: spacing(2);
  }
}
</style>
