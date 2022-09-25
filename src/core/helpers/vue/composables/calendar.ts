import dayjs, { type Dayjs } from "dayjs";
import { computed, ref } from "vue";

export interface useCalendarProps {
  min?: string | Dayjs;
  max?: string | Dayjs;
}

export default function useCalendar(props?: useCalendarProps) {
  const monthNames = dayjs()
    .localeData()
    .months()
    .map((m: string) => m[0].toUpperCase() + m.substring(1));

  const weekdaysName = dayjs().localeData().weekdays();

  const currentMonth = ref(dayjs().month());
  const currentYear = ref(dayjs().year());

  const daysInCurrentMonth = computed(() => {
    return dayjs().month(currentMonth.value).daysInMonth();
  });

  function incrementMonth() {
    if (currentMonth.value < 11) {
      currentMonth.value = currentMonth.value + 1;
    } else {
      currentMonth.value = 0;
      currentYear.value = currentYear.value + 1;
    }
  }

  function decrementMonth() {
    if (currentMonth.value === 0) {
      currentMonth.value = 11;
      currentYear.value = currentYear.value - 1;
    } else {
      currentMonth.value = currentMonth.value - 1;
    }
  }

  const weekDaysLabels = computed(() => {
    const firstDay = dayjs()
      .year(currentYear.value)
      .month(currentMonth.value)
      .date(0)
      .day();

    let list = weekdaysName as string[];
    if (firstDay !== 0) {
      list = [
        ...weekdaysName.filter((d: string, index: number) => index > firstDay),
        ...weekdaysName.filter((d: string, index: number) => index <= firstDay),
      ];
    }
    return list.map((d: string) => d[0].toUpperCase());
  });

  const minMaxAsDaysJs = computed(() => {
    return {
      min: (typeof props?.min === "string"
        ? dayjs(props?.min)
        : (props?.min as Dayjs)
      )
        ?.hour(0)
        ?.minute(0)
        ?.second(0),
      max: (typeof props?.max === "string"
        ? dayjs(props?.max)
        : (props?.max as Dayjs)
      )
        ?.hour(0)
        ?.minute(0)
        ?.second(0),
    };
  });

  function dateCanBeSelected(
    date: number,
    month: number,
    year: number
  ): boolean {
    if (minMaxAsDaysJs.value) {
      if (minMaxAsDaysJs.value.min) {
        if (
          year < minMaxAsDaysJs.value.min.year() ||
          (year == minMaxAsDaysJs.value.min.year() &&
            month < minMaxAsDaysJs.value.min.month()) ||
          (year == minMaxAsDaysJs.value.min.year() &&
            month == minMaxAsDaysJs.value.min.month() &&
            date < minMaxAsDaysJs.value.min.date())
        ) {
          return false;
        }
      }
      if (minMaxAsDaysJs.value.max) {
        if (
          year > minMaxAsDaysJs.value.max.year() ||
          (year == minMaxAsDaysJs.value.max.year() &&
            month > minMaxAsDaysJs.value.max.month()) ||
          (year == minMaxAsDaysJs.value.max.year() &&
            month == minMaxAsDaysJs.value.max.month() &&
            date > minMaxAsDaysJs.value.max.date())
        ) {
          return false;
        }
      }
    }

    return true;
  }

  return {
    daysInCurrentMonth,
    incrementMonth,
    decrementMonth,
    weekDaysLabels,
    dateCanBeSelected,
    minMaxAsDaysJs,
    currentMonth,
    currentYear,
    monthNames,
    weekdaysName,
  };
}
