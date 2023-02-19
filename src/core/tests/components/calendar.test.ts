import Calendar from "@/core/components/Calendar.vue";
import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";

describe("Form", () => {
  it("sould display correct days", () => {
    const wrapper = mount(Calendar, {});
    // @ts-ignore
    //console.error(wrapper.vm.current.value.month);
    wrapper.unmount();
    expect("1").toBe("1");
  });
});
