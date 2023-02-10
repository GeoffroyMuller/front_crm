import { mount } from "@vue/test-utils";
import Form from "../components/form/Form.vue";
import { describe, it, expect } from "vitest";
import { h, ref } from "vue";
import TextField from "../components/form/TextField.vue";

describe("Form", () => {
  it("should contains what slot.default contain", () => {
    const div = '<div class="test">test</div>';
    const wrapper = mount(Form, {
      slots: {
        default: div,
      },
    });
    expect(wrapper.html()).contain(div);
    wrapper.unmount();
  });

  it("should update value when input change", async () => {
    const wrapper = mount(Form, {
      slots: {
        default: [h(TextField, { name: "test" }, [])],
      },
    });
    const input = wrapper.find('input[name="test"]');
    await input.setValue("test");
    // @ts-ignore
    expect(wrapper.vm.internalValue).toHaveProperty("test", "test");
    wrapper.unmount();
  });

  it('should emit "submit" event when form is submitted', async () => {
    const WrapperComp = {
      template: `
        <Form>
          <TextField name="test" />
          <button type="submit">
            SUBMIT
          </button>
        </Form>
        `,
      components: {
        Form,
        TextField,
      },
    };
    const wrapper = mount(WrapperComp);
    const form = wrapper.findComponent(Form);
    const input = form.find('input[name="test"]');
    await input.setValue("test");
    await form.trigger("submit");
    await form.vm.$nextTick();

    expect(form.emitted("submit")).toBeTruthy();
    // @ts-ignore
    expect(form.emitted("submit")?.[0]?.[0]?.test).toBe("test");
    wrapper.unmount();
  });
});
