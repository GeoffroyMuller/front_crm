<template>
  <Page :title="$t('menu.events')">
    <Calendar is-card @click="($d) => clickOnDate($d.dayjs)">
      <template #mounth-day="{ day }">
        {{ day.day }}
        <div
          v-for="e of getEventsForDtstart(day.dayjs)"
          :key="e.id"
          @click.stop="edit(e)"
        >
          <Card>
            <div class="text">
              {{ e.summary }}
            </div>
            <div class="text2">
              {{ e.description }}
            </div>
          </Card>
        </div>
      </template>
    </Calendar>
    <FloatingButton @click.stop="editOpen = true">
      <Icon name="add" />
    </FloatingButton>

    <EditEventSidebar
      @add="fetch()"
      @update="fetch()"
      :event="eventEdited"
      v-model:open="editOpen"
    />
  </Page>
</template>

<script setup lang="ts">
import EditEventSidebar from "@/components/events/EditEventSidebar.vue";
import Page from "@/components/Page.vue";
import Calendar from "@/core/components/Calendar.vue";
import Card from "@/core/components/Card.vue";
import FloatingButton from "@/core/components/FloatingButton.vue";
import Icon from "@/core/components/Icon.vue";
import useEventsStore from "@/stores/events";
import type { Event } from "@/types/events";
import dayjs, { type Dayjs } from "dayjs";
import { computed, onMounted, ref } from "vue";

function getEventsForDtstart(dtstart: Dayjs) {
  return (
    events.value.filter((e) => isDateEqual(e.dtstart as string, dtstart)) || []
  );
}

function isDateEqual(date1: Dayjs | string, date2: Dayjs | string) {
  const date1Djs = typeof date1 === "string" ? dayjs(date1) : date1;
  const date2Djs = typeof date2 === "string" ? dayjs(date2) : date2;
  return date1Djs.format("YYYY-MM-DD") === date2Djs.format("YYYY-MM-DD");
}

const eventStore = useEventsStore();

async function fetch() {
  try {
    eventStore.fetchList();
  } catch (err) {
    console.error(err);
  }
}

onMounted(() => {
  fetch();
});

const events = computed(() => eventStore.getList);

const editOpen = ref(false);
const eventEdited = ref<Event>();

function clickOnDate(date: Dayjs) {
  eventEdited.value = {
    dtstart: date.format("YYYY-MM-DD"),
  };
  editOpen.value = true;
}

function edit(e: Event) {
  console.error({ e });
  eventEdited.value = e;
  editOpen.value = true;
}
</script>
