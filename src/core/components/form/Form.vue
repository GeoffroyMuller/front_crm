<template>
  <form @submit="handleSumbit">
    <slot :hasError="hasError" />
  </form>
</template>

<script lang="ts" setup>
import { ref, provide, defineEmits, computed } from "vue";
import { isEmpty, omitBy, isNil } from "lodash";

interface FormProps {
  defaultValue?: any;
}

interface _CustomInput {
  name: string;
  getValue: () => any;
  validate: () => boolean | string;
  getError: () => boolean | string | undefined;
}

const props = withDefaults(defineProps<FormProps>(), {
  defaultValue: {},
});

const emit = defineEmits(["submit", "inputChange"]);

const inputs = ref<{ [key: string]: _CustomInput }>({});
const errors = ref<{ [key: string]: string | boolean | undefined }>({});

function register(props: _CustomInput) {
  inputs.value[props.name] = props;
}

function unregister(name: string) {
  delete inputs.value[name];
}

function inputChange(name: string) {
  emit("inputChange", {
    name: name,
    value: inputs.value[name].getValue(),
  });
}

function inputErrorChange(name: string) {
  errors.value[name] = inputs.value[name].getError();
}

function validate() {
  errors.value = {};

  return Object.keys(inputs.value).reduce((prev, currentKey) => {
    const input: _CustomInput = inputs.value[currentKey];
    // @ts-ignore
    const valid = input.validate();

    if (!valid || typeof valid === "string") {
      // @ts-ignore
      errors.value[input.name] = valid;
    }
    return prev && valid;
  }, true);
}

const hasError = computed(() => !isEmpty(omitBy(errors.value, isNil)));

function getFormData() {
  // @ts-ignore
  const inputsArray = Object.values(inputs.value);
  return inputsArray.reduce((prev: any, input: _CustomInput) => {
    if (input.name) {
      return { ...prev, [input.name]: input.getValue() };
    }
    return prev;
  }, {});
}

function handleSumbit(event: Event) {
  event.preventDefault();
  validate();
  if (!hasError.value) {
    emit("submit", getFormData());
  }
}

provide("form", {
  register,
  unregister,
  inputChange,
  inputErrorChange,
  defaultValue: props.defaultValue,
});
</script>
