import Repetable from "@/core/components/form/repetable/Repetable.vue";
import { config, mount } from "@vue/test-utils";
import { describe, it, expect, vi } from "vitest";
import { h, ref } from "vue";
import TextField from "@/core/components/form/TextField.vue";
import setup from "@/core/setup";
import routes from "@/routes";

/* describe("Repetable", () => {
  it("should containe initial value of content inputs", () => {
    const wrapper = mount(Repetable, {
      slots: {
        default: () => [h(TextField, { name: "test", modelValue: "test" }, [])],
      },
    });
    // @ts-ignore
    expect(wrapper.vm.internalValue).toHaveProperty("test", "test");
  });
}); */
