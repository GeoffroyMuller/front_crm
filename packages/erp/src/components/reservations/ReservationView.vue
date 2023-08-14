<template>
  <div class="reservation-view">
    <Grid :gap="1">
      <div class="typo-title2">
        {{ $t("reservation") }}
      </div>
      <Card padding>
        <div class="reservation-actions" :gap="1">
          <Button
            variant="text"
            @click.stop="$emit('click-edit', reservation)"
            icon="edit"
          >
            {{ $t("edit") }}
          </Button>
        </div>

        <div class="reservation-content">
          <Grid :gap="5" :columns="{ xs: 1, sm: 2 }">
            <Grid :gap="1" :columns="1">
              <div class="typo-label">
                {{ $t("firstname") }}:
                {{
                  reservation?.client != null && reservation.client?.firstname
                    ? reservation.client?.firstname
                    : "-"
                }}
              </div>
              <div class="typo-label">
                {{ $t("lastname") }}:
                {{
                  reservation?.client != null && reservation.client?.lastname
                    ? reservation.client?.lastname
                    : "-"
                }}
              </div>
              <div class="typo-label">
                {{ $t("email") }}:
                {{
                  reservation?.client != null && reservation.client?.email
                    ? reservation.client?.email
                    : "-"
                }}
              </div>
              <div class="typo-label">
                {{ $t("phone") }}:
                {{
                  reservation?.client != null && reservation.client?.phone
                    ? reservation.client?.phone
                    : "-"
                }}
              </div>
              <div class="typo-label">
                {{ $t("address") }}:
                {{
                  reservation?.client != null && reservation.client?.address
                    ? reservation.client?.address
                    : "-"
                }}
              </div>
            </Grid>
            <div>
              <Flex
                :gap="1"
                direction="column"
                alignItems="flex-end"
                justifyContent="flex-start"
              >
                <div class="typo-label">
                  {{ $t("dtstart") }}:
                  {{
                    reservation.dtstart
                      ? $utils.formatDate(reservation.dtstart)
                      : "-"
                  }}
                </div>
                <div class="typo-label">
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
          <div class="reservation-description typo-label">
            {{ $t("description") }}: {{ reservation?.description ? "" : "-" }}
            <div
              class="reservation-description-text"
              v-if="reservation?.description"
            >
              {{ reservation?.description }}
            </div>
          </div>
          <Grid class="reservation-products" :gap="2">
            <Grid :gap="1">
              <template
                v-if="reservation.lines && reservation.lines.length > 0"
              >
                <div class="typo-label">
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
                      <Flex justify-content="space-between" class="typo-label">
                        <div>{{ $t("name") }}</div>
                        <div>{{ line.product?.name }}</div>
                      </Flex>
                      <Flex justify-content="space-between" class="typo-label">
                        <div>{{ $t("description") }}</div>
                        <div>{{ line.product?.description || "-" }}</div>
                      </Flex>
                      <Flex justify-content="space-between" class="typo-label">
                        <div>{{ $t("quantity") }}</div>
                        <div>{{ line.qty || "-" }}</div>
                      </Flex>
                    </Grid>
                  </Card>
                </div>
              </template>
              <div v-else class="typo-label">
                {{ `${$t("products")} : -` }}
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
import Card from "core/src/components/card/Card.vue";
import Flex from "core/src/components/layouts/Flex.vue";
import Grid from "core/src/components/layouts/Grid.vue";
import type { Reservation } from "@/types/reservation";
import type { SaleLine } from "@/modules/billing/types";
import useProductsStore from "@/modules/products/stores/products";
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
.reservation-actions {
  padding: spacing(0.5) spacing(2);
  display: flex;
  align-items: center;
  gap: spacing(1);
  background-color: color("primary", 50);
}
.reservation-content {
  padding: spacing(2);
  .reservation-description {
    margin-top: spacing(2);
    .reservation-description-text {
      margin-top: spacing(0.5);
      margin-left: spacing(1);
      line-height: 1rem;
    }
  }
  .reservation-products {
    margin-top: spacing(3);
  }
}
</style>
