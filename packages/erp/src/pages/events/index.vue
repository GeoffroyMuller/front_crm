<template>
  <Page :title="$t('menu.events')">
    <Calendar is-card @click="($d) => clickOnDate($d.dayjs)" :events="events">
      <template #mounth-day="{ events: _events, day }">
        <BlockCalendarEvents @edit="edit" :date="day.dayjs" :events="_events" />
      </template>
      <!-- <template #hover-footer>
        <Flex align-items="center" justify-content="center">
          <Button type="button" variant="text">{{ $t("add") }}</Button>
        </Flex>
      </template> -->
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
import BlockCalendarEvents from "@/components/events/BlockCalendarEvents.vue";
import EditEventSidebar from "@/components/events/EditEventSidebar.vue";
import Page from "@/components/Page.vue";
import Button from "core/src/components/Button.vue";
import Calendar from "core/src/components/Calendar.vue";
import FloatingButton from "core/src/components/FloatingButton.vue";
import Icon from "core/src/components/Icon.vue";
import Flex from "core/src/components/layouts/Flex.vue";
import useEventsStore from "@/stores/events";
import type { Event } from "@/types/events";
import type { Dayjs } from "dayjs";
import { computed, onMounted, ref, watch } from "vue";

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
    dtstart: date.toISOString(),
  };
  editOpen.value = true;
}

function edit(e: Event) {
  console.error({ e });
  eventEdited.value = e;
  editOpen.value = true;
}
</script>
