<template>
  <div class="grid gap-1">
    {{ date.date() }}
    <div v-for="e of events" :key="e.id" @click.stop="$emit('edit', e)">
      <Card
        class="event-block gap-[5px] pr-[5px] flex py-2 items-center"
        selectable
        :selected="isSelected(e)"
      >
        <div class="typo-title7 font-semibold ml-[10px]">E</div>
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
  isSelected: (e: any) => boolean;
}

const emit = defineEmits([]);
const props = withDefaults(defineProps<BlockCalendarEventsProps>(), {});

function getEventTitle(e: Event) {
  return `${dayjs(e.dtstart).format("H")}h - ${(e as Event)?.summary}`;
}
</script>

<style lang="scss" scoped>
.event-block {
  position: relative;
  overflow: hidden;
  &::before {
    content: " ";
    position: absolute;
    height: 100%;
    top: 0;
    left: 0;
    width: 5px;
    @apply bg-primary-400;
    z-index: 20;
  }
}
</style>
