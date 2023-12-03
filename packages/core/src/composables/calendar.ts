import dayjs, { type Dayjs } from "dayjs";
import { computed, ref, type Ref } from "vue";

export type Day = {
  day: number;
  year: number;
  month: number;
  id: string;
  dayjs: Dayjs;
};

export interface useCalendarProps {
  min?: string | Dayjs;
  max?: string | Dayjs;
  // 0 for sunday, 6 for saturday
  firstDayDisplayIndex: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  value?: Ref;
  weekMode?: Ref<boolean>;
  equalColumnsForEachLines?: boolean;
}

export default function useCalendar(props: useCalendarProps) {
  const monthNames = dayjs()
    .localeData()
    .months()
    .map((m: string) => m[0].toUpperCase() + m.substring(1));

  const weekdaysName = dayjs().localeData().weekdays();

  const weekMode = props.weekMode ? props.weekMode : ref(false);

  const current = ref<{
    month: number;
    year: number;
    hour: number | null;
    minute: number | null;
    week: number;
  }>({
    month: dayjs().month(),
    year: dayjs().year(),
    hour: null,
    minute: null,
    week: 0,
  });

  function increment() {
    if (weekMode.value) {
      if (current.value.week < 5) {
        current.value.week = current.value.week + 1;
        current.value = { ...current.value };
        return;
      } else {
        current.value.week = 0;
      }
    }
    if (current.value.month < 11) {
      current.value.month = current.value.month + 1;
    } else {
      current.value.month = 0;
      current.value.year = current.value.year + 1;
    }
    current.value = { ...current.value };
  }

  function decrement() {
    if (weekMode.value) {
      if (current.value.week > 0) {
        current.value.week = current.value.week - 1;
        current.value = { ...current.value };
        return;
      } else {
        current.value.week = 5;
      }
    }
    if (current.value.month === 0) {
      current.value.month = 11;
      current.value.year = current.value.year - 1;
    } else {
      current.value.month = current.value.month - 1;
    }
    current.value = { ...current.value };
  }
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

    return list.map((d: string) => d.substring(0, 3).toUpperCase() + ".");
  });

  function isDateSelected(day: number, month: number, year: number) {
    if (props.value?.value == null) {
      return false;
    }
    const value = dayjs(props.value.value);
    return (
      value?.date() == day && value?.month() == month && value?.year() == year
    );
  }

  function dateCanBeSelected(
    date: number,
    month: number,
    year: number
  ): boolean {
    if (props.min) {
      const min = dayjs(props.min);
      if (
        year < min.year() ||
        (year == min.year() && month < min.month()) ||
        (year == min.year() && month == min.month() && date < min.date())
      ) {
        return false;
      }
    }
    if (props.max) {
      const max = dayjs(props.max);
      if (
        year > max.year() ||
        (year == max.year() && month > max.month()) ||
        (year == max.year() && month == max.month() && date > max.date())
      ) {
        return false;
      }
    }
    return true;
  }

  const daysToDisplayMounth = computed<Day[]>(() => {
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

    if (props.equalColumnsForEachLines) {
      let date = dayjs()
        .year(res[res.length - 1].year)
        .month(res[res.length - 1].month)
        .date(res[res.length - 1].day)
        .add(1, "day");
      while (res.length < 42) {
        res.push({
          day: date.date(),
          month: date.month(),
          year: date.year(),
        });
        date = date.add(1, "day");
      }
    }

    return res.map((date) => {
      return {
        ...date,
        id:
          date.day +
          "-" +
          date.month +
          "-" +
          date.year +
          `current-${current.value.month}`,
        dayjs: dayjs()
          .month(date.month)
          .year(date.year)
          .date(date.day)
          .hour(0)
          .minute(0)
          .second(0)
          .millisecond(0),
      };
    });
  });

  const daysToDisplay = computed<Day[]>(() => {
    if (weekMode.value) {
      return daysToDisplayMounth.value.slice(
        7 * current.value.week,
        7 * current.value.week + 7
      );
    }
    return daysToDisplayMounth.value;
  });

  function setCurrentToday() {
    current.value = {
      month: dayjs().month(),
      year: dayjs().year(),
      hour: null,
      minute: null,
      week: 0,
    };
  }

  return {
    increment,
    decrement,
    weekDaysLabels,
    monthNames,
    isDateSelected,
    dateCanBeSelected,
    daysToDisplay,
    current,
    setCurrentToday,
  };
}
