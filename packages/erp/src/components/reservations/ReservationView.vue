<template>
  <div class="reservation-view">
    <Grid :gap="1">
      <div class="typo-title">
        {{ $t("reservation") }}
      </div>
      <Card :withPadding="false">
        <Flex class="reservation-actions" :gap="1">
          <Button
            variant="text"
            @click.stop="$emit('click-edit', reservation)"
            icon="edit"
          >
            {{ $t("edit") }}
          </Button>
        </Flex>
        <div class="reservation-content">
          <Grid :gap="5" :columns="{ xs: 1, sm: 2 }">
            <Grid v-if="reservation?.client != null" :gap="1" :columns="1">
              <div class="typo-text2">
                {{ $t("firstname") }}: {{ reservation.client?.firstname }}
              </div>
              <div class="typo-text2">
                {{ $t("lastname") }}: {{ reservation.client?.lastname }}
              </div>
              <div class="typo-text2">
                {{ $t("email") }}: {{ reservation.client?.email }}
              </div>
              <div class="typo-text2">
                {{ $t("phone") }}: {{ reservation.client?.phone }}
              </div>
              <div class="typo-text2">
                {{ $t("address") }}: {{ reservation.client?.address }}
              </div>
            </Grid>
            <div>
              <Flex
                :gap="1"
                direction="column"
                alignItems="flex-end"
                justifyContent="flex-start"
              >
                <div class="typo-text2">
                  {{ $t("dtstart") }}:
                  {{
                    reservation.dtstart
                      ? $utils.formatDate(reservation.dtstart)
                      : "-"
                  }}
                </div>
                <div class="typo-text2">
                  {{ $t("dtend") }}:
                  {{
                    reservation.dtend
                      ? $utils.formatDate(reservation.dtend)
                      : "-"
                  }}
                </div>
              </Flex>
            </div>
          </Grid>

          <Grid class="reservation-products" :gap="2" v-if="reservation.lines">
            <Grid :gap="1">
              <div class="typo-text2">
                {{ `${$t("products")} :` }}
              </div>
              <!-- <Table
                :columns="[
                  {
                    title: $t('name'),
                    key: 'name',
                  },
                  {
                    title: $t('description'),
                    key: 'description',
                    sortable: true,
                  },
                  {
                    title: $t('quantity'),
                    key: 'quantity',
                    sortable: true,
                  },
                ]"
                :items="[...(reservation.lines || [])]"
              >
                <template #content-name="{ item }">
                  {{ item.product.name }}
                </template>
                <template #content-description="{ item }">
                  {{ item.product.description || "-" }}
                </template>
                <template #content-quantity="{ item }">
                  {{ item.qty || "-" }}
                </template>
              </Table> -->
              <div v-for="line in reservation.lines" :key="line.id">
                <Card>
                  <Grid :gap="1">
                    <Flex justify-content="space-between" class="typo-text2">
                      <div>{{ $t("name") }}</div>
                      <div>{{ line.product?.name }}</div>
                    </Flex>
                    <Flex justify-content="space-between" class="typo-text2">
                      <div>{{ $t("description") }}</div>
                      <div>{{ line.product?.description || "-" }}</div>
                    </Flex>
                    <Flex justify-content="space-between" class="typo-text2">
                      <div>{{ $t("quantity") }}</div>
                      <div>{{ line.qty || "-" }}</div>
                    </Flex>
                  </Grid>
                </Card>
              </div>
            </Grid>
            <Flex justify-content="flex-start">
              <Button
                type="button"
                variant="text"
                v-if="isPreparable"
                @click.stop="$emit('prepare-products-real')"
              >
                {{ $t("pages.edit-reservation.prepare-the-products") }}
              </Button>
            </Flex>
          </Grid>
        </div>
      </Card>
    </Grid>
  </div>
</template>

<script setup lang="ts">
import Button from "core/src/components/Button.vue";
import Card from "core/src/components/Card.vue";
import Flex from "core/src/components/layouts/Flex.vue";
import Grid from "core/src/components/layouts/Grid.vue";
import type { Reservation } from "@/types/reservation";
import type { SaleLine } from "@/types/sale";
import useProductsStore from "@/stores/products";
import { isNil } from "lodash";
import { computed } from "vue";
import Table from "core/src/components/Table.vue";

const emit = defineEmits(["prepare-products-real", "click-edit"]);
const productsStore = useProductsStore();

interface ReservationViewProps {
  reservation: Reservation;
}
const props = withDefaults(defineProps<ReservationViewProps>(), {});

const isPreparable = computed(() => {
  if (props.reservation?.lines) {
    const res = props.reservation?.lines?.find((line: SaleLine) =>
      productsStore.isPhysicalStock(line.product)
    );
    if (isNil(res)) {
      return false;
    } else {
      return true;
    }
  }
  return false;
});
</script>
<style lang="scss" scoped>
.reservation-view {
  padding: spacing(2);
  .typo-title {
    margin-bottom: spacing(2);
  }
}
.reservation-actions {
  padding: spacing(0.5) spacing(2);
  background-color: color("primary", 50);
}
.reservation-content {
  padding: spacing(2);
  .reservation-products {
    margin-top: spacing(5);
  }
}
</style>
