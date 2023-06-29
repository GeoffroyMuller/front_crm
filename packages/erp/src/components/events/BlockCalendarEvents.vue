<template>
  <Grid :gap="0.5" :columns="1">
    {{ date.date() }}
    <div v-for="e of events" :key="e.id" @click.stop="$emit('edit', e)">
      <Card class="event-block" rounded="sm">
        <Flex align-items="center" :gap="0.5" :m="0.5" :ml="1" :mr="1">
          <div class="typo-text">{{ dayjs(e.dtstart).format("H") }}h</div>
          <div class="typo-text">-</div>
          <div class="typo-text">
            {{ e.summary }}
          </div>
        </Flex>
      </Card>
    </div>
  </Grid>
</template>

<script setup lang="ts">
import Card from "core/src/components/card/Card.vue";
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
  background-color: white;
  padding: spacing(0.5);
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
