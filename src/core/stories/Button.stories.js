import "../assets/style/main.scss";
import Button from "../components/Button.vue";
import argTypes from "./argstypes";
// More on default export: https://storybook.js.org/docs/vue/writing-stories/introduction#default-export
export default {
  title: "Example/Button",
  component: Button,
  // More on argTypes: https://storybook.js.org/docs/vue/api/argtypes
  argTypes: {
    ...argTypes,
    variant: {
      control: { type: "select" },
      options: ["base", "text", "outlined"],
    },
    type: {
      control: { type: "select" },
      options: ["button", "submit", "reset"],
    },
    align: {
      control: { type: "select" },
      options: ["center", "end", "start"],
    },
  },
  args: {
    color: "primary",
    variant: "base",
  },
};

// More on component templates: https://storybook.js.org/docs/vue/writing-stories/introduction#using-args
const Template = (args) => ({
  // Components used in your story `template` are defined in the `components` object
  components: { Button },
  // The story's `args` need to be mapped into the template through the `setup()` method
  setup() {
    return { args };
  },
  // And then the `args` are bound to your component with `v-bind="args"`
  template: '<Button v-bind="args">Button</Button>',
});

export const Primary = Template.bind({});
