<template>
  <div class="datepicker-container">
    <Menu @close="validate()" :disabled="disabled">
      <template #activator>
        <TextField
          :label="label"
          :model-value="displayed"
          :error="internalError || error ? true : false"
          readonly
          :disabled="disabled"
          @focus="isFocus = true"
          @blur="isFocus = false"
        >
          <template #icon>
            <Icon
              name="calendar_month"
              :color="!isFocus ? 'black' : internalError || error ? 'danger' : 'primary'"
            />
          </template>
        </TextField>
      </template>
      <template #default>
        <div class="datepicker">
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
        </div>
      </template>
    </Menu>
    <Alert v-if="internalError || error">
      {{ internalError || error }}
    </Alert>
  </div>
</template>
<script setup lang="ts">
import useValidatable from "@/core/helpers/vue/composables/validatable";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { computed, ref } from "vue";
import Menu from "../Menu.vue";
import TextField from "./TextField.vue";
import Alert from "../Alert.vue";
import IconButton from "../IconButton.vue";
import Icon from "../Icon.vue";
import type { AnySchema } from "yup";

export interface DatePickerProps {
  // 0 for sunday, 6 for saturday
  firstDayDisplayIndex?: 0 | 1 | 2 | 3 | 4 | 5 | 6;

  modelValue?: string;
  min?: Dayjs;
  max?: Dayjs;
  label?: string;
  name?: string;
  error?: string;
  rules?: AnySchema;
  disabled?: boolean;
}

const isFocus = ref(false);

const monthNames = dayjs()
  .localeData()
  .months()
  .map((m: string) => m[0].toUpperCase() + m.substring(1));

const weekdaysName = dayjs().localeData().weekdays();

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
    id: date.day + "-" + date.month + "-" + date.year + `current-${current.value.month}`,
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

function dateCanBeSelected(date: number, month: number, year: number): boolean {
  if (props.min) {
    if (
      year < props.min.year() ||
      (year == props.min.year() && month < props.min.month()) ||
      (year == props.min.year() && month == props.min.month() && date < props.min.date())
    ) {
      return false;
    }
  }
  if (props.max) {
    if (
      year > props.max.year() ||
      (year == props.max.year() && month > props.max.month()) ||
      (year == props.max.year() && month == props.max.month() && date > props.max.date())
    ) {
      return false;
    }
  }

  return true;
}
</script>

<style lang="scss">
.datepicker-container {
  display: grid;
  width: 100%;
  gap: spacing(1);
}
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
