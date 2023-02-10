import { shallowMount } from "@vue/test-utils";
import Form from "../components/form/Form.vue";
import { describe, it, expect } from "vitest";

describe("Form", () => {
  it("should contains what slot.default contain", () => {
    const div = '<div class="test">test</div>';
    const wrapper = shallowMount(Form, {
      slots: {
        default: div,
      },
    });
    expect(wrapper.html()).contain(div);
  });
});
