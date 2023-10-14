<template>
  <Menu
    v-model:open="open"
    class="datepicker-input"
    :placement="placement"
    :alignment="alignment"
  >
    <template #activator>
      <SelectActivator v-if="$slots.activator">
        <slot name="activator" />
      </SelectActivator>
      <div v-else>
        <TextField
          :model-value="displayed"
          :label="label"
          :error="internalError || error ? true : false"
          :disabled="disabled"
          @focus="isFocus = true"
          @blur="isFocus = false"
          :mask="mask"
          @update:model-value="handleInputChange"
        >
          <template #icon>
            <Icon
              name="calendar_month"
              :disabled="disabled"
              :color="!isFocus ? 'black' : 'primary'"
            />
          </template>
        </TextField>
      </div>
    </template>
    <template #content>
      <div class="datetimepicker" @click.stop :class="{ time }">
        <div class="datepicker">
          <div class="datepicker-header">
            <div>{{ monthNames[current.month] }} {{ current.year }}</div>
            <div class="datepicker-header-actions -mx-iconButtonPadding">
              <IconButton name="chevron_left" @click.stop="decrementMonth()" />
              <IconButton name="chevron_right" @click.stop="incrementMonth()" />
            </div>
          </div>
          <div class="datepicker-content">
            <div v-for="(day, index) of weekDaysLabels" :key="index" class="weekday">
              {{ day }}
            </div>
            <div
              v-for="date in daysToDisplay"
              :key="date.id"
              @click="onSelectDate(date.dayjs)"
              class="day"
              :class="{
                'last-month': date.month !== current.month,
                selected: isDateSelected(date.day, date.month, date.year),
                disabled: !dateCanBeSelected(date.day, date.month, date.year),
              }"
            >
              {{ date.day }}
            </div>
          </div>
        </div>
        <div class="timepicker">
          <div class="hours">
            <div
              v-for="index in 24"
              :key="index"
              :class="{ selected: current?.hour == index - 1 }"
              @click="current.hour = index - 1"
            >
              {{ index - 1 }}
            </div>
          </div>
          <div class="minutes">
            <div
              v-for="index in 60"
              :key="index"
              :class="{ selected: current?.minute == index - 1 }"
              @click="current.minute = index - 1"
            >
              {{ index - 1 }}
            </div>
          </div>
        </div>
      </div>
    </template>
  </Menu>

  <Alert v-if="internalError || error">
    {{ internalError || error }}
  </Alert>
</template>
<script setup lang="ts">
import useValidatable from "../../../composables/validatable";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { computed, ref } from "vue";
import TextField from "../TextField.vue";
import Alert from "../../Alert.vue";
import type { AnySchema } from "yup";
import Menu, { type MenuProps } from "../../Menu.vue";
import useCalendar from "../../../composables/calendar";
import IconButton from "../../IconButton.vue";
import { Mask } from "maska";
import Icon from "../../Icon.vue";
import SelectActivator from "../../SelectActivator.vue";

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

  placement?: MenuProps["placement"];
  alignment?: MenuProps["alignment"];

  time?: boolean;
}

const open = ref(false);

const isFocus = ref(false);

const props = withDefaults(defineProps<DatePickerProps>(), {
  firstDayDisplayIndex: 1,
});

const { internalValue, internalError, validate } = useValidatable({
  value: props.modelValue,
  error: props.error,
  rules: props.rules,
});

const format = computed(() => {
  return props.time ? "DD/MM/YYYY HH:mm" : "DD/MM/YYYY";
});

const displayed = computed(() => {
  if (!internalValue?.value?.length) {
    return "";
  }
  return new Mask({ mask: mask.value }).unmasked(
    dayjs(internalValue.value).format(format.value)
  );
});

const mask = computed(() => {
  // @ts-ignore
  return format.value.replaceAll(/[a-zA-Z]/g, "#");
});

function handleInputChange(value: string) {
  if (!value.length) {
    internalValue.value = undefined;
    validate();
    return;
  }
  const date = dayjs(value, format.value);
  if (date.isValid()) {
    internalValue.value = date.toISOString();
    current.value.hour = date.hour();
    current.value.minute = date.minute();
    validate();
    open.value = false;
  }
}

function onSelectDate(date: Dayjs) {
  const newValue = date
    .hour(current.value.hour || 0)
    .minute(current.value.minute || 0)
    .toISOString();
  if (newValue === internalValue.value) {
    internalValue.value = undefined;
  } else {
    internalValue.value = newValue;
  }

  validate();
  open.value = false;
}

const {
  dateCanBeSelected,
  daysToDisplay,
  decrement: decrementMonth,
  increment: incrementMonth,
  isDateSelected,
  current,
  monthNames,
  weekDaysLabels,
} = useCalendar({
  value: internalValue,
  min: props.min,
  max: props.max,
  firstDayDisplayIndex: props.firstDayDisplayIndex,
});
</script>

<style lang="scss">
.datepicker-input {
  width: 100%;
}
.datetimepicker {
  display: flex;
  .timepicker {
    display: none;
  }
  min-width: 280px;
  &.time {
    min-width: 380px;
    .datepicker {
      border-right: solid 1px #d3d3d3;
    }
    .timepicker {
      display: flex;
      .hours,
      .minutes {
        overflow-x: hidden;
        overflow-y: scroll;
        > * {
          padding: spacing(1.5);
          margin: spacing(0.75);
          border-radius: map-deep-get($rounded, "sm");
          user-select: none;
          cursor: pointer;
          text-align: center;
          &.selected {
            background-color: color("primary", 500);
            color: color("white");
          }
        }
        /* Hide scrollbar for Chrome, Safari and Opera */
        &::-webkit-scrollbar {
          display: none;
        }
        /* Hide scrollbar for IE, Edge and Firefox */
        -ms-overflow-style: none;
      }
    }
  }
  .datepicker {
    @include grid(1, 0, 2);
    padding: spacing(2);
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
}
</style>
