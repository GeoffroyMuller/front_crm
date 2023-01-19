<template>
  <Grid :gap="0.5" :columns="1">
    {{ date.date() }}
    <div
      v-for="e of getEventsForDtstart(date)"
      :key="e.id"
      @click.stop="$emit('edit', e)"
    >
      <Card :with-padding="false">
        <Flex align-items="center" :gap="0.5" :p="0.5">
          <div class="text">{{ dayjs(e.dtstart).format("H") }}h</div>
          <div class="text">-</div>
          <div class="text">
            {{ e.summary }}
          </div>
        </Flex>
      </Card>
    </div>
  </Grid>
</template>

<script setup lang="ts">
import Card from "@/core/components/Card.vue";
import Flex from "@/core/components/layouts/Flex.vue";
import Grid from "@/core/components/layouts/Grid.vue";
import type { Event } from "@/types/events";
import dayjs, { type Dayjs } from "dayjs";

function getEventsForDtstart(dtstart: Dayjs) {
  return (
    props.events.filter((e) => isDateEqual(e.dtstart as string, dtstart)) || []
  );
}

function isDateEqual(date1: Dayjs | string, date2: Dayjs | string) {
  const date1Djs = typeof date1 === "string" ? dayjs(date1) : date1;
  const date2Djs = typeof date2 === "string" ? dayjs(date2) : date2;
  return date1Djs.format("YYYY-MM-DD") === date2Djs.format("YYYY-MM-DD");
}

interface BlockCalendarEventsProps {
  events: Array<Event>;
  date: Dayjs;
}

const emit = defineEmits([]);
const props = withDefaults(defineProps<BlockCalendarEventsProps>(), {});
</script>
