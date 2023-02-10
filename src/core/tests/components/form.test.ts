import { mount } from "@vue/test-utils";
import Form from "../../components/form/Form.vue";
import { describe, it, expect } from "vitest";
import { h, ref } from "vue";
import TextField from "../../components/form/TextField.vue";

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

  it("sould have errors when an input is invalid at init", async () => {
    const wrapper = mount(Form, {
      slots: {
        default: [h(TextField, { name: "test", error: "test" }, [])],
      },
    });
    // @ts-ignore
    expect(wrapper.vm.hasError).toBe(true);
    wrapper.unmount();
  });

  it("sould update errors when an input update error", async () => {
    const wrapper = mount(Form, {
      slots: {
        default: [h(TextField, { name: "test" }, [])],
      },
    });
    const input = wrapper.findComponent(TextField);
    // @ts-ignore
    input.vm.internalError = "test";
    await input.vm.$nextTick();
    // @ts-ignore
    expect(wrapper.vm.hasError).toBe(true);
    wrapper.unmount();
  });

  it("should delete corresponding data when unregister an input", async () => {
    const wrapper = mount(Form, {
      slots: {
        default: [
          h("div", { name: "test" }, [h(TextField, { name: "test" }, [])]),
        ],
      },
    });
    const input = wrapper.findComponent(TextField);
    // @ts-ignore
    input.vm.internalValue = "test";
    await input.vm.$nextTick();
    // @ts-ignore
    wrapper.vm.unregister("test");

    // @ts-ignore
    expect(wrapper.vm.internalValue?.test).toBe(undefined);
    wrapper.unmount();
  });

  it("should update:modelValue on input change", async () => {
    let data: any = {};
    const wrapper = mount(Form, {
      props: {
        "onUpdate:modelValue": (val: any) => (data = val),
      },
      slots: {
        default: [h(TextField, { name: "test" }, [])],
      },
    });
    const input = wrapper.find('input[name="test"]');
    await input.setValue("test");
    await wrapper.vm.$nextTick();
    // @ts-ignore
    expect(data.test).toBe("test");
    wrapper.unmount();
  });

  it("should update:modelValue on input unregister", async () => {
    let data: any = { test: "test" };
    const wrapper = mount(Form, {
      props: {
        "onUpdate:modelValue": (val: any) => (data = val),
        modelValue: {},
      },
      slots: {
        default: [h(TextField, { name: "test" }, [])],
      },
    });
    expect(data.test).toBe("test");
    // @ts-ignore
    wrapper.vm.unregister("test");
    await wrapper.vm.$nextTick();
    expect(data.test).toBe(undefined);
    wrapper.unmount();
  });

  it("should update:modelValue on input register", async () => {
    let data: any = {};
    const wrapper = mount(Form, {
      props: {
        "onUpdate:modelValue": (val: any) => (data = val),
      },
    });

    // @ts-ignore
    wrapper.vm.register({
      name: "test",
      internalValue: ref("test"),
      internalError: ref(""),
      validate: () => true,
    });
    await wrapper.vm.$nextTick();
    expect(data.test).toBe("test");
    wrapper.unmount();
  });
});
