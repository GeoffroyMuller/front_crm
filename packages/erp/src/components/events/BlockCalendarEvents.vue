<template>
  <Grid :gap="0.5" :columns="1">
    {{ date.date() }}
    <div v-for="e of events" :key="e.id" @click.stop="$emit('edit', e)">
      <Card :with-padding="false" class="event-block">
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
import Card from "core/src/components/Card.vue";
import Flex from "core/src/components/layouts/Flex.vue";
import Grid from "core/src/components/layouts/Grid.vue";
import type { Event } from "@/types/events";
import dayjs, { type Dayjs } from "dayjs";

interface BlockCalendarEventsProps {
  events: Array<Event>;
  date: Dayjs;
}

const emit = defineEmits([]);
const props = withDefaults(defineProps<BlockCalendarEventsProps>(), {});
</script>

<style lang="scss" scoped>
.event-block {
  background-color: color("primary", 50);
}
</style>
