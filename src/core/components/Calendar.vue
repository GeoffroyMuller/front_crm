<template>
  <component :is="isCard ? Card : 'div'" class="calendar">
    <div class="calendar-header">
      <div class="date">{{ monthNames[current.month] }} {{ current.year }}</div>
      <div class="buttons">
        <IconButton name="chevron_left" @click.stop="decrementMonth()" />
        <IconButton name="chevron_right" @click.stop="incrementMonth()" />
      </div>
    </div>
    <div class="calendar-content" ref="calendarContent">
      <div v-for="day of weekDaysLabels" :key="day" class="weekday">
        {{ day }}
      </div>
      <div
        class="day"
        v-for="day in datesToDisplay"
        :key="day.id"
        @click.stop="clickOnDay(day)"
        :class="{
          'not-this-month': day.month != current.month || day.year != current.year,
        }"
      >
        {{ day.day }}
      </div>
    </div>
  </component>
</template>
<script setup lang="ts">
import dayjs from "dayjs";
import { computed, onMounted, ref } from "vue";
import IconButton from "./IconButton.vue";
import Card from "./Card.vue";

export type Day = { day: number; year: number; month: number; id?: string };

const calendarContent = ref();

// code for infinite scroll
/* 
function handleScroll() {
  const scrollPosition = calendarContent.value.scrollTop;
  const pageBottom = calendarContent.value.offsetHeight;
  const percentScrolled = (scrollPosition / pageBottom) * 100;
  if (percentScrolled > 90) {
    incrementMonth();
    scrollToCenter();
  }
  if (percentScrolled < 10) {
    decrementMonth();
    scrollToCenter();
  }

onMounted(() => {
  //calendarContent.value.style.height = `calc(100vh - ${calendarContent.value.offsetTop}px)`;
  //scrollToCenter();
  //calendarContent.value.addEventListener("scroll", handleScroll);
});
*/

const monthNames = dayjs()
  .localeData()
  .months()
  .map((m: string) => m[0].toUpperCase() + m.substring(1));

const weekdaysName = dayjs().localeData().weekdays();

const datesToDisplay = computed(() => {
  const daysInCurrentMonth = dayjs().month(current.value.month).daysInMonth();
  const res: Array<Day> = [];
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

  for (let day = 1; day <= daysInCurrentMonth; day++) {
    res.push({
      day,
      month: current.value.month,
      year: current.value.year,
    });
  }

  const limitDay = props.firstDayDisplayIndex > 0 ? props.firstDayDisplayIndex - 1 : 7;
  let date = dayjs()
    .year(res[res.length - 1].year)
    .month(res[res.length - 1].month)
    .date(res[res.length - 1].day);
  while (date.day() != limitDay) {
    res.push({
      day: date.date(),
      month: date.month(),
      year: date.year(),
    });
    date = date.add(1, "day");
  }

  return res.map((date) => ({
    ...date,
    id: `${date.day}-${date.month}-${date.year}-current-${current.value.month}`,
  }));
});

const current = ref({
  month: dayjs().month(),
  year: dayjs().year(),
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

function scrollToCenter() {
  const pageBottom = calendarContent.value.offsetHeight;
  calendarContent.value.scrollTo(0, pageBottom / 2);
}

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

function clickOnDay(day: Day) {
  emit("click", day);
}

interface CalendarProps {
  // 0 for sunday, 6 for saturday
  firstDayDisplayIndex?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  isCard?: boolean;
}

const props = withDefaults(defineProps<CalendarProps>(), {
  firstDayDisplayIndex: 1,
});

const emit = defineEmits(["click"]);
</script>

<style lang="scss">
.calendar {
  border-radius: map-deep-get($rounded, "sm");
  .calendar-header {
    border-bottom: solid 1px black;
    @include flex(row, flex-start, center, 1);
    padding-top: spacing(2);
    padding-bottom: spacing(2);
    .date {
    }
    .buttons {
      display: flex;
      button {
        padding: 0;
      }
    }
  }
  .calendar-content {
    @include grid(7, 0, 0);
    border: solid 1px black;
    border-left: none;
    border-top: none;
    overflow-y: auto;
    .day {
      border: solid 1px black;
      border-bottom: none;
      border-right: none;
      height: 180px;
      padding: spacing(1);
      &:hover {
        background-color: color("primary", 50);
        cursor: pointer;
      }
      &.not-this-month {
        color: rgb(175, 173, 173);
      }
    }
    .weekday {
      border: solid 1px black;
      border-bottom: none;
      border-right: none;
      border-top: none;
      padding: spacing(1);
    }
  }
}
</style>
