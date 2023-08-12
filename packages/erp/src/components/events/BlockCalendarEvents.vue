<template>
  <div class="grid gap-1">
    {{ date.date() }}
    <div v-for="e of events" :key="e.id" @click.stop="$emit('edit', e)">
      <Card class="event-block p-2 pl-3 flex gap-1 items-center" rounded="sm">
        <div class="typo-title7 font-semibold">E</div>
        <div class="typo-text5 font-semibold">
          {{ getEventTitle(e) }}
        </div>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import Card from "core/src/components/card/Card.vue";
import type { Event } from "@/types/events";
import dayjs, { type Dayjs } from "dayjs";

interface BlockCalendarEventsProps {
  events: Array<Event>;
  date: Dayjs;
}

const emit = defineEmits([]);
const props = withDefaults(defineProps<BlockCalendarEventsProps>(), {});

function getEventTitle(e: Event) {
  return `${dayjs(e.dtstart).format("H")}h - ${(e as Event)?.summary}`;
}
</script>

<style lang="scss" scoped>
.event-block {
  background-color: white;
  position: relative;
  overflow: hidden;
  &::before {
    content: " ";
    position: absolute;
    height: 100%;
    top: 0;
    left: 0;
    width: 5px;
    background-color: color("primary", 400);
    z-index: 999;
  }
}
</style>
