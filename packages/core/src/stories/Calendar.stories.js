import "../plugins/daysjs";
import "../assets/style/main.scss";
import Calendar from "../components/Calendar.vue";
import argTypes from "./argstypes";
// More on default export: https://storybook.js.org/docs/vue/writing-stories/introduction#default-export
export default {
  title: "Example/Calendar",
  component: Calendar,
  // More on argTypes: https://storybook.js.org/docs/vue/api/argtypes
  argTypes: {
    ...argTypes(),
  },
  args: {
    isCard: true,
  },
};

// More on component templates: https://storybook.js.org/docs/vue/writing-stories/introduction#using-args
const Template = (args) => ({
  // Components used in your story `template` are defined in the `components` object
  components: { Calendar },
  // The story's `args` need to be mapped into the template through the `setup()` method
  setup() {
    return { args };
  },
  // And then the `args` are bound to your component with `v-bind="args"`
  template: '<Calendar v-bind="args"></Calendar>',
});

export const Primary = Template.bind({});
