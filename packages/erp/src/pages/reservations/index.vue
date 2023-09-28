<template>
  <Page :title="$t('reservations')" icon="event">
    <MagicFilterBar
      mapSearch="$contains.description"
      :filters="[]"
      :map="{}"
      :store="reservationStore"
    />
    <MagicDataTable
      :store="reservationStore"
      :columns="[
        {
          title: $t('customer'),
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

    <Sidebar v-model:open="isSidebarOpen" padding>
      <div class="sidebar-reservation-form">
        <ReservationPrepareProductsReal
          v-show="isPrepareProductsReal"
          :reservation="formDataReservation"
          @saved="
            (res: Reservation) => {
              reservationSelected = res;
              isPrepareProductsReal = false;
            }
          "
          @back="
            () => {
              isPrepareProductsReal = false;
              formDataReservation = { ...reservationSelected } as Reservation;
            }
          "
        />
        <ReservationForm
          v-show="(!reservationSelected || isEdit) && !isPrepareProductsReal"
          :initialReservation="reservationSelected"
          v-model:reservation="formDataReservation"
          @back="backToView"
          @saved="(res: Reservation) => {
              reservationSelected = res;
            }"
          @prepare-products-real="
            () => {
              isPrepareProductsReal = true;
            }
          "
        ></ReservationForm>
        <ReservationView
          v-if="isView"
          @click-edit="
            (res) => {
              formDataReservation = res;
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
import Page from "core/src/components/Page.vue";
import useReservationStore from "@/stores/reservations";
import type { Reservation } from "@/types/reservation";
import Sidebar from "core/src/components/sidebar/Sidebar.vue";
import { computed, ref, watch } from "vue";
import ReservationForm from "@/components/reservations/ReservationForm.vue";
import Button from "core/src/components/Button.vue";
import ReservationView from "@/components/reservations/ReservationView.vue";
import useUI from "core/src/composables/ui";
import ReservationPrepareProductsReal from "@/components/reservations/ReservationPrepareProductsReal.vue";
import MagicFilterBar from "core/src/components/magic/MagicFilterBar.vue";

const { toast, confirm } = useUI();

const reservationStore = useReservationStore();

const isSidebarOpen = ref(false);
const reservationSelected = ref<Reservation | null>(null);
const formDataReservation = ref<Reservation | null>(null);
const isEdit = ref<boolean>(false);
const isPrepareProductsReal = ref<boolean>(false);

const isView = computed(() => {
  return (
    reservationSelected.value && !isEdit.value && !isPrepareProductsReal.value
  );
});

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
