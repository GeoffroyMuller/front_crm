<template>
  <Card class="datepicker">
    <div class="datepicker-header">
      <div>{{ monthNames[current.month] }} {{ current.year }}</div>
      <div class="datepicker-header-actions">
        <IconButton name="chevron_left" @click.stop="decrementMonth()" />
        <IconButton name="chevron_right" @click.stop="incrementMonth()" />
      </div>
    </div>
    <div class="datepicker-content">
      <div v-for="day of weekDaysLabels" :key="day" class="weekday">
        {{ day }}
      </div>
      <div
        v-for="date in daysToDisplay"
        :key="date.id"
        @click="onSelectDate(date.day, date.month, date.year)"
        class="day"
        :class="{
          'last-month': date.month !== current.month,
          selected: isSelected(date),
          disabled: !dateCanBeSelected(date.day, date.month, date.year),
        }"
      >
        {{ date.day }}
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { computed, ref, type Ref } from "vue";
import Card from "../../Card.vue";
import IconButton from "../../IconButton.vue";

export interface DatePickerContentProps {
  modelValue: Ref;

  // 0 for sunday, 6 for saturday
  firstDayDisplayIndex?: 0 | 1 | 2 | 3 | 4 | 5 | 6;

  min?: Dayjs;
  max?: Dayjs;

  onUpdate: (date: string) => void;
}

const emit = defineEmits(["update:modelValue"]);
const props = withDefaults(defineProps<DatePickerContentProps>(), {});

const monthNames = dayjs()
  .localeData()
  .months()
  .map((m: string) => m[0].toUpperCase() + m.substring(1));

const weekdaysName = dayjs().localeData().weekdays();

function incrementMonth() {
  if (current.value.month < 11) {
    current.value.month = current.value.month + 1;
  } else {
    current.value.month = 0;
    current.value.year = current.value.year + 1;
  }
}

function decrementMonth() {
  if (current.value.month === 0) {
    current.value.month = 11;
    current.value.year = current.value.year - 1;
  } else {
    current.value.month = current.value.month - 1;
  }
}

function onSelectDate(day: number, month: number, year: number) {
  const result = dayjs().year(year).month(month).date(day).format("YYYY-MM-DD");
  if (props.onUpdate) {
    props.onUpdate(result);
  }
  emit("update:modelValue", result);
}

const daysToDisplay = computed(() => {
  const daysInCurrentMonth = dayjs().month(current.value.month).daysInMonth();
  const res = [];
  if (props.firstDayDisplayIndex !== undefined) {
    const firstDayCurrentMonth = dayjs()
      .year(current.value.year)
      .month(current.value.month)
      .date(0)
      .day();
    const beforeMonth =
      current.value.month === 0 ? 11 : current.value.month - 1;
    const beforeMonthYear =
      current.value.month === 0 ? current.value.year - 1 : current.value.year;
    const daysInBeforeMonth = dayjs()
      .month(current.value.month)
      .subtract(1, "month")
      .daysInMonth();
    for (
      let day = daysInBeforeMonth;
      day > daysInBeforeMonth - firstDayCurrentMonth;
      day--
    ) {
      res.unshift({
        day,
        month: beforeMonth,
        year: beforeMonthYear,
      });
    }
  }
  for (let day = 1; day <= daysInCurrentMonth; day++) {
    res.push({
      day,
      month: current.value.month,
      year: current.value.year,
    });
  }
  return res.map((date) => ({
    ...date,
    id:
      date.day +
      "-" +
      date.month +
      "-" +
      date.year +
      `current-${current.value.month}`,
  }));
});

const weekDaysLabels = computed(() => {
  const firstDay =
    typeof props.firstDayDisplayIndex !== "undefined"
      ? props.firstDayDisplayIndex
      : dayjs()
          .year(current.value.year)
          .month(current.value.month)
          .date(0)
          .day() + 1;
  const list = [
    ...weekdaysName.filter((d: string, index: number) => index >= firstDay),
    ...weekdaysName.filter((d: string, index: number) => index < firstDay),
  ];

  return list.map((d: string) => d[0].toUpperCase());
});

function isSelected(date: any) {
  if (props.modelValue.value == null) {
    return false;
  }
  const value = dayjs(props.modelValue.value);
  return (
    value?.date() == date.day &&
    value?.month() == date.month &&
    value?.year() == date.year
  );
}

function dateCanBeSelected(date: number, month: number, year: number): boolean {
  if (props.min) {
    if (
      year < props.min.year() ||
      (year == props.min.year() && month < props.min.month()) ||
      (year == props.min.year() &&
        month == props.min.month() &&
        date < props.min.date())
    ) {
      return false;
    }
  }
  if (props.max) {
    if (
      year > props.max.year() ||
      (year == props.max.year() && month > props.max.month()) ||
      (year == props.max.year() &&
        month == props.max.month() &&
        date > props.max.date())
    ) {
      return false;
    }
  }

  return true;
}

const current = ref({
  month: dayjs().month(),
  year: dayjs().year(),
});
</script>

<style lang="scss">
.datepicker {
  @include grid(1, 0, 2);
  .datepicker-header {
    margin-bottom: spacing(1.5);
    display: flex;
    align-items: center;
    justify-content: space-between;
    .datepicker-header-actions {
      display: flex;
      justify-content: center;
      button {
        padding: 0;
      }
    }
  }
  .datepicker-content {
    @include grid(7, 0, 0.5);
    .weekday {
      display: grid;
      place-items: center;
      text-align: center;
    }
    .day {
      display: grid;
      place-items: center;
      text-align: center;
      color: black;
      width: spacing(4);
      height: spacing(4);
      border-radius: map-deep-get($rounded, "sm");
      cursor: pointer;
      &.last-month {
        color: rgb(215, 215, 215);
      }
      &.selected,
      &:hover:not(.disabled) {
        background-color: color("primary", 500);
        color: white;
      }
      &.disabled {
        color: rgb(238, 237, 237);
        cursor: not-allowed;
      }
    }
  }
}
</style>
