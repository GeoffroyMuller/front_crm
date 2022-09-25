<template>
  <div ref="inputContainer" class="input-container">
    <TextField
      readonly
      :modelValue="dateDisplayed"
      ref="inputRef"
      :label="label"
      @click.stop="open = !open"
      :error="error"
      @update:error="$emit('update:error', $event)"
    />

    <input :style="{ display: 'none' }" :name="name" :value="internalValue" />

    <div
      v-if="open"
      ref="datePickerContainer"
      class="date-picker-container"
      :class="{ 'display-top': displayTop }"
      @click.stop="$refs?.inputRef?.$refs?.internalRef?.focus()"
    >
      <div class="actions">
        <div class="titles" @click="displayYears = !displayYears">
          {{ monthNames[currentMonth] }} {{ currentYear }}
        </div>
        <div class="buttons">
          <button @click="decrementMonth">{{ "<" }}</button>
          <button @click="incrementMonth">{{ ">" }}</button>
        </div>
      </div>
      <div class="years" v-if="displayYears">
        <button
          v-for="(y, index) of years"
          :key="index"
          class="p-1 rounded-md"
          :class="{
            'bg-indigo-500 text-white hover:bg-indigo-600':
              modelValueAsDaysjs?.year() == y,
            'hover:bg-slate-100': modelValueAsDaysjs?.year() != y,
          }"
          @click="onSelectYear(y)"
        >
          {{ y }}
        </button>
      </div>
      <div class="dates" v-else>
        <div v-for="(day, index) of weekDaysLabels" :key="index" class="weekday">
          {{ day }}
        </div>
        <button
          v-for="date in daysInCurrentMonth"
          :key="date"
          class="monthday"
          :class="{
            'date-selected':
              modelValueAsDaysjs?.date() == date &&
              modelValueAsDaysjs?.month() == currentMonth &&
              modelValueAsDaysjs?.year() == currentYear,
            'cannot-be-selected': !dateCanBeSelected(date, currentMonth, currentYear),
          }"
          @click.stop="onSelectDate(date)"
        >
          {{ date }}
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import TextField from "./TextField.vue";
import dayjs, { Dayjs } from "dayjs";
import {
  computed,
  ref,
  defineProps,
  defineEmits,
  withDefaults,
  watch,
  nextTick,
} from "vue";
import useEventListener from "@/core/helpers/vue/composables/eventListener";
import useCalendar from "@/core/helpers/vue/composables/calendar";

interface DatePickerProps {
  modelValue?: string | Dayjs;
  isBordered?: boolean;
  min?: string | Dayjs;
  max?: string | Dayjs;
  label?: string;
  name?: string;
  error?: string;
}

const props = withDefaults(defineProps<DatePickerProps>(), {});

const emit = defineEmits(["update:modelValue", "update:error"]);

const internalValue = ref<Dayjs | string>("");

const {
  daysInCurrentMonth,
  incrementMonth,
  decrementMonth,
  weekDaysLabels,
  dateCanBeSelected,
  minMaxAsDaysJs,
  currentMonth,
  currentYear,
  monthNames,
} = useCalendar({
  min: props.min,
  max: props.max,
});

/* 
  todo: changer de methode car celle ci impose un click.stop sur le textfield
  et du coup pas de fermeture d'un datepicker si on click sur un autre datepicker...
*/
useEventListener(document.body, "click", () => {
  open.value = false;
});

const inputRef = ref();

function onSelectDate(date: number) {
  const newDateToEmit = dayjs()
    .year(currentYear.value)
    .month(currentMonth.value)
    .date(date)
    .hour(0)
    .minute(0)
    .second(0)
    .millisecond(0)
    .toDate()
    .toDateString();
  internalValue.value = newDateToEmit;
  emit("update:modelValue", newDateToEmit);
  inputRef.value?.$refs?.internalRef?.dispatchEvent(
    new Event("input", {
      bubbles: true,
      cancelable: true,
    })
  );
  open.value = false;
}

const open = ref(false);
watch(
  () => open.value,
  (val: boolean) => {
    if (val) {
      nextTick(() => {
        const pageHeight = document.body.clientHeight;
        const inputContainerBottomYPosition =
          inputContainer.value?.offsetHeight +
          inputContainer.value?.getBoundingClientRect().top +
          datePickerContainer.value.offsetHeight;

        displayTop.value = pageHeight - inputContainerBottomYPosition <= 0;
      });
    }
  }
);

const dateDisplayed = computed(() => {
  if (internalValue.value) {
    return modelValueAsDaysjs.value.format("DD/MM/YYYY");
  }
  return "";
});

const modelValueAsDaysjs = computed(() =>
  typeof internalValue.value === "string"
    ? dayjs(internalValue.value)
    : internalValue.value
);

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      internalValue.value = val;
    }
  },
  { immediate: true }
);

function onSelectYear(year: number) {
  currentYear.value = year;
  displayYears.value = false;
}

const years = computed<Array<number>>(() => {
  const res = [];
  for (
    let index = minMaxAsDaysJs.value?.min?.year() || 1900;
    index <= (minMaxAsDaysJs.value?.max?.year() || 2100);
    index++
  ) {
    res.push(index);
  }
  return res;
});

const displayYears = ref(false);

const inputContainer = ref();
const datePickerContainer = ref();

const displayTop = ref(false);
</script>

<style lang="scss" scoped>
.input-container {
  position: relative;
  .date-picker-container {
    position: absolute;
    max-height: 35opx;
    overflow-y: auto;
    padding: spacing(3);
    background-color: white;
    border-radius: map-get($rounded, "md");
    box-shadow: 10px 10px 5px 0px #f1f5f9;
    z-index: 10;
    .years {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: spacing(1);
      button {
        &:hover {
          background-color: #f1f5f9;
        }
      }
    }
    .dates {
      @include grid(7, 0, 1);
      .weekday {
        text-align: center;
        color: gray;
      }
      .monthday {
        width: 38px;
        height: 38px;
        border-radius: map-get($rounded, "sm");
        &:focus {
          outline: none;
        }
        border: none;
        background-color: transparent;
        cursor: pointer;
        &:hover {
          background-color: #f1f5f9;
        }
        &.cannot-be-selected {
          color: gray;
          cursor: not-allowed;
          pointer-events: none;
        }
        &.date-selected {
          background-color: color("primary", 500);
          color: white;
          &:hover {
            background-color: color("primary", 700);
          }
        }
      }
    }
    .actions {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: spacing(2);
      .titles {
      }
      .buttons {
        button {
          &:focus {
            outline: none;
          }
          border: none;
          background-color: transparent;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
