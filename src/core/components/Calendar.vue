<template>
  <component :is="isCard ? Card : 'div'" class="calendar">
    <div class="calendar-header">
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
    <div class="calendar-content-week" v-if="displayWeek">
      <div class="weekdays">
        <div
          v-for="(day, index) of weekDaysLabels"
          :key="index"
          class="weekday"
        >
          {{ day }}
        </div>
      </div>
      <div class="days">
        <div class="day" v-for="day of datesToDisplay" :key="day.id">
          {{ $utils.formatDate(day.dayjs) }}
        </div>
      </div>
    </div>
    <div class="calendar-content" v-if="!displayWeek">
      <div class="weekdays">
        <div
          v-for="(day, index) of weekDaysLabels"
          :key="index"
          class="weekday"
        >
          {{ day }}
        </div>
      </div>
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

          <slot name="mounth-day" :day="day" />
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
import Card from "./Card.vue";
import useCalendar, { type Day } from "../helpers/vue/composables/calendar";

interface CalendarProps {
  // 0 for sunday, 6 for saturday
  firstDayDisplayIndex?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  isCard?: boolean;
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

function clickOnDay(day: Day) {
  emit("click", day);
}
</script>

<style lang="scss">
$borderColor: #dbdcdc;
$borderRadius: map-deep-get($rounded, "md");

.calendar {
  .calendar-header {
    @include flex(row, space-between, center, 1);
    padding-top: spacing(2);
    padding-bottom: spacing(2);
    .modes,
    .date {
      @include flex(row, flex-start, center, 1);
    }
    .mode {
      cursor: pointer;
      user-select: none;
      padding: spacing(1);
      border-radius: map-deep-get($rounded, "sm");

      &.selected {
        background-color: color("primary", 500);
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
  .calendar-content-week {
    .weekdays {
      @include grid(7, 0, 0);
      border: 1px solid $borderColor;
      border-radius: $borderRadius $borderRadius 0 0;
      background-color: #fafafa;
      .weekday {
        padding: spacing(1);
        &:not(:last-child) {
          border-right: 1px solid $borderColor;
        }
      }
    }
    .days {
      @include grid(7, 0, 0);
      border: 1px solid $borderColor;
      border-radius: 0 0 $borderRadius $borderRadius;
      border-top: 0;
      .day {
        border-left: 1px solid $borderColor;
        padding: spacing(1);
        &:first-child {
          border-left: none;
        }
      }
    }
  }
  .calendar-content {
    .weekdays,
    .days {
      @include grid(7, 0, 0);
      border: 1px solid $borderColor;
    }
    .weekdays {
      border-bottom: 0;
      border-radius: $borderRadius $borderRadius 0 0;
      background-color: #fafafa;
    }
    .days {
      border-top: none;
      border-radius: 0 0 $borderRadius $borderRadius;
      :nth-child(7n) {
        border-right: 0;
      }
    }
    overflow-y: auto;
    .day {
      height: 180px;
      padding: spacing(1);
      border: 1px solid $borderColor;
      border-left: none;
      border-bottom: none;
      overflow: hidden;
      overflow-y: auto;
      &:hover {
        .hover-footer {
          display: block;
        }
      }
      .hover-footer {
        display: none;
        text-align: center;
      }
      &:hover {
        background-color: lighten(color("primary", 50), 1.5%);
        cursor: pointer;
      }
      &.not-this-month {
        color: rgb(175, 173, 173);
      }
    }
    .weekday {
      padding: spacing(1);
      border-right: 1px solid $borderColor;
      &:last-child {
        border-right: none;
      }
    }
  }
}
</style>
