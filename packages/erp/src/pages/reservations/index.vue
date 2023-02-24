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
      <ReservationForm
        v-if="!reservationSelected || isEdit"
        :reservation="reservationSelected"
        @back="backToView"
      ></ReservationForm>
      <ReservationView
        v-else
        @click-edit="
          (res) => {
            reservationSelected = res;
            isEdit = true;
          }
        "
        :reservation="reservationSelected"
      ></ReservationView
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

const { toast, confirm } = useUI();

const reservationStore = useReservationStore();

const isSidebarOpen = ref(false);
const reservationSelected = ref<Reservation | null>(null);
const isEdit = ref<boolean>(false);

watch(
  () => isSidebarOpen.value,
  (open) => {
    if (open) {
      isEdit.value = false;
    }
  }
);

async function fetchReservastionById(item?: Reservation) {
  if (item != null) {
    try {
      reservationSelected.value = await reservationStore.fetchById(item?.id, {
        populate: ["client"],
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
  console.error({ item });
  fetchReservastionById(item);
  isEdit.value = false;
}

async function clickEdit(item?: Reservation) {
  if (item != null) {
    fetchReservastionById(item);
    isSidebarOpen.value = true;
  } else {
    reservationSelected.value = null;
    isSidebarOpen.value = true;
  }
}
</script>
