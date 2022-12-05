<template>
  <Tabs
    :tabs="[
      { id: 'calendar', title: 'Calendar' },
      { id: 'table', title: 'Table' },
    ]"
  >
    <template #calendar>
      <Calendar is-card @click="clickOnDay">
        <template #mounth-day="{ day }">
          {{ day.day }}
          <div class="reservations">
            <Card
              class="reservation"
              v-for="reservation of getDayReservations(day)"
              :key="reservation.id"
              @click.stop="clickOnReservation(reservation)"
            >
              <div>
                {{ reservation.customer.firstname }}
                {{ reservation.customer.lastname }}
              </div>
              <div>Reservation : {{ reservation.date }}</div>
            </Card>
          </div>
        </template>
      </Calendar>
    </template>
    <template #table>
      <DataTable />
    </template>
  </Tabs>

  <Sidebar v-model:open="sidebarOpen">
    <ReservationForm
      :date="selectedDate"
      @done="sidebarOpen = false"
      :value="selectedReservation"
    />
  </Sidebar>
</template>
<script setup lang="ts">
import Calendar, { type Day } from "@/core/components/Calendar.vue";
import dayjs, { Dayjs } from "dayjs";
import { computed, onMounted, ref } from "vue";
import Sidebar from "@/core/components/Sidebar.vue";
import ReservationForm from "../../components/ReservationForm.vue";
import Tabs from "@/core/components/Tabs.vue";
import DataTable from "@/core/components/DataTable.vue";
import usePage from "@/features/composables/page";
import { useReservationStore } from "@/features/stores/reservations";
import type Reservation from "@/features/types/reservation";
import Card from "../../../core/components/Card.vue";

const reservationStore = useReservationStore();

usePage("Reservations");

const sidebarOpen = ref(false);
const selectedReservation = ref();
const newTaskDay = ref<Dayjs>();

onMounted(async () => {
  await reservationStore.fetchList();
});

const reservations = computed(() => {
  return reservationStore.getList || [];
});

const selectedDate = computed(() => {
  if (newTaskDay.value == null) {
    return "";
  }
  return newTaskDay.value.format("DD/MM/YYYY");
});

function clickOnDay(day: Day) {
  sidebarOpen.value = true;
  newTaskDay.value = day.dayjs;
  selectedReservation.value = null;
}

function clickOnReservation(reservation: Reservation) {
  sidebarOpen.value = true;
  selectedReservation.value = reservation;
}

function getDayReservations(day: Day): Array<Reservation> {
  return reservations.value.filter((r: Reservation) => {
    const date = dayjs(r.date);
    if (
      date.date() === (day.dayjs as Dayjs).date() &&
      date.month() === (day.dayjs as Dayjs).month() &&
      date.year() === (day.dayjs as Dayjs).year()
    ) {
      return true;
    }
    return false;
  });
}
</script>

<style lang="scss">
.reservations {
  @include grid(1, 0, 0.5);
  .reservation {
    overflow: hidden;
    padding: spacing(0.5);
    background-color: rgb(84, 84, 84);
    color: white;
  }
}
</style>
