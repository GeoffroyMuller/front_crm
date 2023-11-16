<template>
  <component
    :is="wrapperComponent === 'card' ? Card : 'div'"
    class="calendar"
    :class="{ rounded, 'calendar-full-screen': fullScreen }"
  >
    <div class="calendar-header h-[60px] sticky top-0 bg-white">
      <div class="date">
        <div class="buttons">
          <IconButton name="chevron_left" @click.stop="decrement()" />
          <IconButton name="chevron_right" @click.stop="increment()" />
        </div>
        <div>{{ monthNames[current.month] }} {{ current.year }}</div>
      </div>
      <div class="modes">
        <div
          class="mode"
          :class="{ selected: !displayWeek }"
          @click="displayWeek = false"
        >
          month
        </div>
        <div
          class="mode"
          :class="{ selected: displayWeek }"
          @click="displayWeek = true"
        >
          week
        </div>
      </div>
    </div>
    <div class="weekdays sticky top-[60px]">
      <div
        v-for="(day, index) of weekDaysLabels"
        :key="index"
        class="weekday typo-title6 text-slate-500"
      >
        {{ day }}
      </div>
    </div>
    <div class="calendar-content-week" v-if="displayWeek">
      <div class="days">
        <div class="day" v-for="day of datesToDisplay" :key="day.id">
          <span v-if="!$slots['mounth-day']">
            {{ $utils.formatDate(day.dayjs) }}
          </span>
          <slot
            name="mounth-day"
            :day="day"
            :events="getEventsForDtstart(day.dayjs)"
          />
        </div>
      </div>
    </div>
    <div class="calendar-content" v-if="!displayWeek">
      <div class="days">
        <div
          class="day"
          v-for="day in datesToDisplay"
          :key="day.id"
          @click.stop="clickOnDay(day)"
          :class="{
            'not-this-month':
              day.month != current.month || day.year != current.year,
          }"
        >
          <span v-if="!$slots['mounth-day']">
            {{ day.day }}
          </span>

          <slot
            name="mounth-day"
            :day="day"
            :events="getEventsForDtstart(day.dayjs)"
          />
          <div class="hover-footer" v-if="$slots['hover-footer']">
            <slot name="hover-footer" :day="day" />
          </div>
        </div>
      </div>
    </div>
  </component>
</template>
<script setup lang="ts">
import { ref } from "vue";
import IconButton from "./IconButton.vue";
import Card from "./card/Card.vue";
import useCalendar, { type Day } from "../composables/calendar";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";

export interface CalendarEvent {
  id?: number;
  dtstamp?: string | Dayjs;
  dtstart?: string | Dayjs;
  dtend?: string | Dayjs;
  summary?: string;
  description?: string;
  location?: string;
  recurrence_freq?: null | "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";
  recurrence_interval?: number;
  recurrence_count?: number;
  recurrence_until?: string;
}

interface CalendarProps {
  // 0 for sunday, 6 for saturday
  firstDayDisplayIndex?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  wrapperComponent?: "card" | "div";
  events?: Array<CalendarEvent>;
  rounded?: boolean;
  fullScreen?: boolean;
}

const props = withDefaults(defineProps<CalendarProps>(), {
  firstDayDisplayIndex: 1,
});

const emit = defineEmits(["click"]);

const displayWeek = ref(false);

const {
  current,
  weekDaysLabels,
  monthNames,
  increment,
  decrement,
  daysToDisplay: datesToDisplay,
} = useCalendar({
  weekMode: displayWeek,
  equalColumnsForEachLines: true,
  firstDayDisplayIndex: props.firstDayDisplayIndex,
});

function getDayjsManipulateTypeFromRecurrenceFreq(
  recurrenceFreq: CalendarEvent["recurrence_freq"]
) {
  switch (recurrenceFreq) {
    case "DAILY":
      return "day";
    case "WEEKLY":
      return "week";
    case "MONTHLY":
      return "month";
    case "YEARLY":
      return "year";
    default:
      return "day";
  }
}

/* 
  @TODO : prendre en compte les frequence du type
  "every 2 days" ou "every 3 weeks" et "every first monday of the month"
*/
function getEventsForDtstart(dtstart: Dayjs) {
  if (!props.events?.length) return [];
  return (
    props.events.filter((e) => {
      if (
        dayjs(e.dtstart as string).format("YYYY-MM-DD") ===
        dayjs(dtstart).format("YYYY-MM-DD")
      ) {
        return true;
      }
      if (e.recurrence_freq && e.recurrence_interval) {
        const recurrenceUntil = e.recurrence_until
          ? dayjs(e.recurrence_until)
          : null;
        const recurrenceInterval = e.recurrence_interval;
        const recurrenceFreq = e.recurrence_freq;
        const recurrenceDtstart = dayjs(e.dtstart as string);
        let recurrenceDtstartTemp = recurrenceDtstart;
        let recurrenceCountTemp = 0;
        while (
          (!recurrenceUntil ||
            recurrenceDtstartTemp.isBefore(recurrenceUntil)) &&
          (!e.recurrence_count || recurrenceCountTemp < +e.recurrence_count) &&
          recurrenceDtstartTemp.isBefore(dtstart.add(1, "day"))
        ) {
          if (
            recurrenceDtstartTemp.format("YYYY-MM-DD") ===
            dayjs(dtstart).format("YYYY-MM-DD")
          ) {
            return true;
          }
          recurrenceDtstartTemp = recurrenceDtstartTemp.add(
            recurrenceInterval,
            getDayjsManipulateTypeFromRecurrenceFreq(recurrenceFreq)
          );
          if (recurrenceCountTemp != null) {
            recurrenceCountTemp++;
          }
        }
      }
      return false;
    }) || []
  );
}

function clickOnDay(day: Day) {
  emit("click", day);
}
</script>

<style lang="scss">
$borderColor: #dbdcdc;
$borderRadius: map-deep-get($rounded, "md");

.calendar {
  .calendar-header {
    @apply flex justify-between items-center gap-2 p-4;
    border-bottom: solid color("slate", 200) 1px;
    opacity: 1;
    z-index: 21;
    .modes,
    .date {
      @apply flex justify-start items-center gap-2;
    }
    .mode {
      cursor: pointer;
      user-select: none;
      @apply p-2;
      border-radius: map-deep-get($rounded, "sm");

      &.selected {
        background: color("primary", 500);
        background: linear-gradient(
          245deg,
          color("primary", 500) 0%,
          color("primary", 400) 100%
        );
        color: white;
      }
    }

    .date {
      .buttons {
        display: flex;
        button {
          padding: 0;
        }
      }
    }
  }
  .weekdays {
    @include grid(7, 0, 0);
    border: none;
    background-color: white;
    z-index: 21;
    .weekday {
      @apply p-2;
      border-bottom: 1px solid $borderColor;
      &:not(:last-child) {
        border-right: 1px solid $borderColor;
      }
    }
  }
  .calendar-content-week {
    .days {
      @include grid(7, 0, 0);
      border: 1px solid $borderColor;
      background-color: color("slate", 50);
      border-top: 0;
      .day {
        border-left: 1px solid $borderColor;
        @apply p-2;
        &:first-child {
          border-left: none;
        }
      }
    }
  }
  .calendar-content {
    .days {
      @include grid(7, 0, 0);
      border: 1px solid $borderColor;
    }
    .days {
      border-top: none;
      background-color: color("slate", 50);
      > *:not(:nth-child(1n + 8)) {
        border-top: 0;
      }
      :nth-child(7n) {
        border-right: 0;
      }
    }
    overflow-y: auto;
    .day {
      height: 180px;
      @apply p-2;
      border: 1px solid $borderColor;
      border-left: none;
      border-bottom: none;
      overflow: hidden;
      overflow-y: auto;
      position: relative;
      &:hover {
        .hover-footer {
          display: block;
        }
      }
      .hover-footer {
        display: none;
        text-align: center;
        position: absolute;
        @apply bottom-1;
        left: 50%;
        transform: translateX(-50%);
        z-index: 4;
      }
      &::before {
        content: " ";
        @apply transition-all bg-primary-500 absolute bottom-2 right-2 w-[5px] h-[5px] opacity-0 rounded-full shadow shadow-primary-400;
      }
      &:hover {
        position: relative;
        &::before {
          content: " ";
          @apply opacity-50;
        }
        cursor: pointer;
      }
      &.not-this-month {
        color: rgb(175, 173, 173);
      }
    }
    .weekday {
      @apply p-2;
      border-right: 1px solid $borderColor;
      &:last-child {
        border-right: none;
      }
    }
  }
  &.calendar-full-screen {
    background-color: color("white");
    .days,
    .weekdays {
      border-right: 0;
      border-left: 0;
    }
  }
}
</style>
