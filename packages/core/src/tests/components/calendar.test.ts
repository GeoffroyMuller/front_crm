import "../../plugins/daysjs";
import useCalendar from "../../composables/calendar";
import { describe, expect, it } from "vitest";
import { ref } from "vue";

describe("useCalendar", () => {
  it("should contain correct days", () => {
    const { current, daysToDisplay } = useCalendar({
      firstDayDisplayIndex: 1,
      equalColumnsForEachLines: true,
    });
    current.value = {
      ...current.value,
      year: 2023,
      month: 1,
    };

    expect(daysToDisplay.value.map((d) => d.day)).toMatchObject([
      30, 31, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
      20, 21, 22, 23, 24, 25, 26, 27, 28, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
    ]);

    current.value = {
      ...current.value,
      year: 2025,
      month: 3,
    };

    expect(daysToDisplay.value.map((d) => d.day)).toMatchObject([
      31, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
      21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
    ]);
  });

  it("should contain correct days one weeks", () => {
    const { current, daysToDisplay } = useCalendar({
      firstDayDisplayIndex: 1,
      equalColumnsForEachLines: true,
      weekMode: ref(true),
    });
    current.value = {
      ...current.value,
      year: 2022,
      month: 12,
      week: 5,
    };

    expect(daysToDisplay.value.map((d) => d.day)).toMatchObject([
      26, 27, 28, 29, 30, 31, 1,
    ]);
  });

  it("should daysToDisplay.daysjs.date() = daysToDisplay.day", () => {
    const { current, daysToDisplay } = useCalendar({
      firstDayDisplayIndex: 1,
      equalColumnsForEachLines: true,
    });
    current.value = {
      ...current.value,
      year: 2023,
      month: 1,
    };

    expect(daysToDisplay.value[0].dayjs.date()).toBe(
      daysToDisplay.value[0].day
    );
  });
});
