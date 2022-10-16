<template>
  <Menu>
    <template #activator>
      <TextField
        :label="label"
        :full-width="fullWidth"
        :model-value="displayed"
        :error="internalError"
        icon="calendar_month"
      />
    </template>
    <template #default>
      <div class="datepicker">
        <div class="datepicker-header">
          <div>{{ monthNames[current.month] }} {{ current.year }}</div>
          <div class="datepicker-header-actions">
            <Button
              icon="chevron_left"
              variant="text"
              color="black"
              @click.stop="decrementMonth()"
            />
            <Button
              icon="chevron_right"
              variant="text"
              color="black"
              @click.stop="incrementMonth()"
            />
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
            }"
          >
            {{ date.day }}
          </div>
        </div>
      </div>
    </template>
  </Menu>
</template>
<script setup lang="ts">
import type { Rules } from "@/core/helpers/rules";
import useValidatable from "@/core/helpers/vue/composables/validatable";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { computed, ref } from "vue";
import Menu from "../Menu.vue";
import TextField from "./TextField.vue";
import Button from "../Button.vue";

const monthNames = dayjs()
  .localeData()
  .months()
  .map((m: string) => m[0].toUpperCase() + m.substring(1));

const weekdaysName = dayjs().localeData().weekdays();

interface DatePickerProps {
  fullWidth?: boolean;
  // 0 for sunday, 6 for saturday
  firstDayDisplayIndex?: 0 | 1 | 2 | 3 | 4 | 5 | 6;

  modelValue?: string;
  min?: Dayjs;
  max?: Dayjs;
  label?: string;
  name?: string;
  error?: string;
  rules?: Rules;
}

const props = withDefaults(defineProps<DatePickerProps>(), {
  firstDayDisplayIndex: 1,
});

const emit = defineEmits(["update:modelValue", "update:error"]);

const { internalValue, internalError, validate } = useValidatable({
  value: props.modelValue,
  error: props.error,
  rules: props.rules,
});

const current = ref({
  month: dayjs().month(),
  year: dayjs().year(),
});

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
  internalValue.value = dayjs().year(year).month(month).date(day).format("YYYY-MM-DD");
  validate();
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
    const beforeMonth = current.value.month === 0 ? 11 : current.value.month - 1;
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
    id: date.day + "-" + date.month + "-" + date.year,
  }));
});

const weekDaysLabels = computed(() => {
  const firstDay =
    typeof props.firstDayDisplayIndex !== "undefined"
      ? props.firstDayDisplayIndex
      : dayjs().year(current.value.year).month(current.value.month).date(0).day() + 1;
  const list = [
    ...weekdaysName.filter((d: string, index: number) => index >= firstDay),
    ...weekdaysName.filter((d: string, index: number) => index < firstDay),
  ];

  return list.map((d: string) => d[0].toUpperCase());
});

function isSelected(date: any) {
  const value = dayjs(internalValue.value);
  return (
    value?.date() == date.day &&
    value?.month() == date.month &&
    value?.year() == date.year
  );
}

const displayed = computed(() => {
  if (!internalValue?.value?.length) {
    return "";
  }
  return dayjs(internalValue.value).format("DD/MM/YYYY");
});
</script>

<style lang="scss">
.datepicker {
  @include grid(1, 0, 2);
  .datepicker-header {
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
      &:hover {
        background-color: color("primary", 500);
        color: white;
      }
    }
  }
}
</style>
