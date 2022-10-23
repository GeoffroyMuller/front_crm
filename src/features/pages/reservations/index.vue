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
        </template>
      </Calendar>
    </template>
    <template #table>
      <DataTable />
    </template>
  </Tabs>

  <Sidebar v-model:open="sidebarOpen">
    <ReservationForm :date="selectedDate" @done="sidebarOpen = false" :value="task" />
  </Sidebar>
</template>
<script setup lang="ts">
import Calendar, { type Day } from "@/core/components/Calendar.vue";
import dayjs from "dayjs";
import { computed, ref } from "vue";
import Sidebar from "@/core/components/Sidebar.vue";
import ReservationForm from "../../components/ReservationForm.vue";
import Tabs from "@/core/components/Tabs.vue";
import DataTable from "@/core/components/DataTable.vue";
import usePage from "@/features/composables/page";

usePage("Reservations");

const sidebarOpen = ref(false);
const task = ref();
const newTaskDay = ref<Day>();

const selectedDate = computed(() => {
  if (newTaskDay.value == null) {
    return null;
  }
  return dayjs()
    .date(newTaskDay.value.day)
    .month(newTaskDay.value.month)
    .year(newTaskDay.value.year)
    .format("DD/MM/YYYY");
});

function clickOnDay(day: Day) {
  sidebarOpen.value = true;
  newTaskDay.value = day;
}

function clickOnTask(t: any) {
  sidebarOpen.value = true;
  // fake
  const res = {
    customer: {
      firstname: "Etienne",
      lastname: "ROBERT",
    },
  };
  task.value = res;
}
</script>
