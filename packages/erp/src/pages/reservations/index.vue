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
      <ReservationForm :reservation="reservationSelected"></ReservationForm>
    </Sidebar>
  </Page>
</template>

<script lang="ts" setup>
import MagicDataTable from "core/src/components/magic/MagicDataTable.vue";
import Page from "@/components/Page.vue";
import useReservationStore from "@/stores/reservations";
import type { Reservation } from "@/types/reservation";
import Sidebar from "core/src/components/Sidebar.vue";
import { ref } from "vue";
import ReservationForm from "@/components/reservations/ReservationForm.vue";
import Button from "core/src/components/Button.vue";

const reservationStore = useReservationStore();

const isSidebarOpen = ref(false);
const reservationSelected = ref<Reservation | null>(null);

function clickEdit(item?: Reservation) {
  if (item != null) {
    reservationSelected.value = item;
    isSidebarOpen.value = true;
  } else {
    reservationSelected.value = null;
    isSidebarOpen.value = true;
  }
}
</script>
