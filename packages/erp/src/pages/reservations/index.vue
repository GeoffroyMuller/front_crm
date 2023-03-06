<template>
  <Page :title="$t('reservations')">
    <MagicDataTable
      :store="reservationStore"
      :columns="[
        {
          title: $t('client'),
          key: 'client',
          sortable: true,
        },
        {
          title: $t('description'),
          key: 'description',
          sortable: false,
        },
        {
          title: $t('dtstart'),
          key: 'dtstart',
          sortable: true,
        },
        {
          title: $t('dtend'),
          key: 'dtend',
          sortable: true,
        },
        {
          title: $t('created_at'),
          key: 'created_at',
          sortable: true,
        },
      ]"
      @row-click="(reservation: Reservation) => clickEdit(reservation)"
    >
      <template #content-client="{ item }: { item: Reservation }">
        <div>{{ item.client?.firstname }} {{ item.client?.lastname }}</div>
      </template>
      <template #content-dtstart="{ item }: { item: Reservation }">
        {{ item.dtstart ? $utils.formatDate(item.dtstart) : "-" }}
      </template>
      <template #content-dtend="{ item }: { item: Reservation }">
        {{ item.dtend ? $utils.formatDate(item.dtend) : "-" }}
      </template>
      <template #content-created_at="{ item }: { item: Reservation }">
        {{ item.created_at ? $utils.formatDate(item.created_at) : "-" }}
      </template>
      <template #actions-title>
        <div>
          <Button
            color="success"
            icon="add"
            v-tooltip="{ text: $t('add'), placement: 'bottom' }"
            @click="
              (e) => {
                e.stopPropagation();
                clickEdit();
              }
            "
          >
            {{ $t("add") }}
          </Button>
        </div>
      </template>
    </MagicDataTable>

    <Sidebar v-model:open="isSidebarOpen">
      <div class="sidebar-reservation-form">
        <ReservationPrepareProductsReal
          v-if="isPrepareProductsReal"
          v-model:reservation="formDataReservation"
          @back="
            () => {
              isPrepareProductsReal = false;
            }
          "
        />
        <ReservationForm
          v-if="(!reservationSelected || isEdit) && !isPrepareProductsReal"
          :initialReservation="reservationSelected"
          v-model:reservation="formDataReservation"
          @back="backToView"
          @prepare-products-real="
            () => {
              isPrepareProductsReal = true;
            }
          "
        ></ReservationForm>
        <ReservationView
          v-else-if="!isPrepareProductsReal && reservationSelected"
          @click-edit="
            (res) => {
              reservationSelected = res;
              isEdit = true;
            }
          "
          @prepare-products-real="
            () => {
              isPrepareProductsReal = true;
            }
          "
          :reservation="reservationSelected"
        ></ReservationView></div
    ></Sidebar>
  </Page>
</template>

<script lang="ts" setup>
import MagicDataTable from "core/src/components/magic/MagicDataTable.vue";
import Page from "@/components/Page.vue";
import useReservationStore from "@/stores/reservations";
import type { Reservation } from "@/types/reservation";
import Sidebar from "core/src/components/Sidebar.vue";
import { ref, watch } from "vue";
import ReservationForm from "@/components/reservations/ReservationForm.vue";
import Button from "core/src/components/Button.vue";
import ReservationView from "@/components/reservations/ReservationView.vue";
import useUI from "core/src/composables/ui";
import ReservationProductRealLine from "@/components/reservations/ReservationProductRealLine.vue";
import ReservationPrepareProductsReal from "@/components/reservations/ReservationPrepareProductsReal.vue";

import { isNil } from "lodash";

const { toast, confirm } = useUI();

const reservationStore = useReservationStore();

const isSidebarOpen = ref(false);
const reservationSelected = ref<Reservation | null>(null);
const formDataReservation = ref<Reservation | null>(null);
const isEdit = ref<boolean>(false);
const isPrepareProductsReal = ref<boolean>(false);

watch(
  () => isSidebarOpen.value,
  (open) => {
    if (open) {
      isEdit.value = false;
      isPrepareProductsReal.value = false;
    }
  }
);

watch(
  () => reservationSelected.value,
  (val) => {
    formDataReservation.value = val;
  }
);

async function fetchReservastionById(item?: Reservation) {
  if (item != null) {
    try {
      reservationSelected.value = await reservationStore.fetchById(item?.id, {
        populate: ["client", "lines", "lines.product", "lines.sublines"],
      });
    } catch (error: any) {
      toast({
        type: "danger",
        message: error.response.data.message,
      });
    }
  }
}

async function backToView(item?: Reservation) {
  await fetchReservastionById(item);
  isEdit.value = false;
}

async function clickEdit(item?: Reservation) {
  isPrepareProductsReal.value = false;
  if (item != null) {
    await fetchReservastionById(item);
    isSidebarOpen.value = true;
  } else {
    reservationSelected.value = null;
    isSidebarOpen.value = true;
  }
}
</script>
<style lang="scss">
.sidebar-reservation-form {
  max-width: $sidebar-width;
}
</style>
