<template>
  <form @submit="handleSumbit">
    <slot :hasError="hasError" />
  </form>
</template>

<script lang="ts" setup>
import { ref, provide, defineEmits, computed, watch } from "vue";
import { isEmpty, omitBy, isNil } from "lodash";

export interface FormProps {
  modelValue?: any;
}

export interface _CustomInput {
  name: string;
  getValue: () => any;
  setValue: (val: any) => void;
  validate: () => boolean | string;
  getError: () => boolean | string | undefined;
}

const props = withDefaults(defineProps<FormProps>(), {});

const emit = defineEmits(["update:modelValue", "submit", "inputChange"]);

const inputs = ref<{ [key: string]: _CustomInput }>({});
const errors = ref<{ [key: string]: string | boolean | undefined }>({});
const internalValue = ref<any>({});

watch(
  () => props.modelValue,
  () => {
    internalValue.value = props.modelValue;
    if (props.modelValue != null) {
      Object.keys(inputs.value).forEach((key) => {
        if (props.modelValue[key]) {
          inputs.value[key].setValue(props.modelValue[key]);
        }
      });
    } else {
      Object.keys(inputs.value).forEach((key) => {
        inputs.value[key].setValue(undefined);
      });
    }
  },
  {
    immediate: true,
  }
);

watch(
  () => internalValue.value,
  () => emit("update:modelValue", internalValue.value)
);

function register(props: _CustomInput) {
  inputs.value[props.name] = props;
}

function unregister(name: string) {
  delete inputs.value[name];
}

function inputChange(name: string) {
  const value = inputs.value[name].getValue();
  internalValue.value = {
    ...internalValue.value,
    [name]: value,
  };
  emit("inputChange", {
    name,
    value,
  });
}

function inputErrorChange(name: string) {
  errors.value[name] = inputs.value[name].getError();
}

async function validate() {
  errors.value = {};

  return await Object.keys(inputs.value).reduce(async (prev, currentKey) => {
    const input: _CustomInput = inputs.value[currentKey];
    // @ts-ignore
    const valid = await input.validate();

    if (!valid || typeof valid === "string") {
      // @ts-ignore
      errors.value[input.name] = valid;
    }
    return (await prev) && valid;
  }, new Promise((resolve) => resolve(true)));
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

async function handleSumbit(event: Event) {
  event.preventDefault();
  await validate();
  if (!hasError.value) {
    const data = getFormData();
    internalValue.value = data;
    emit("submit", data);
  }
}

provide("form", {
  register,
  unregister,
  inputChange,
  inputErrorChange,
  defaultValue: props.modelValue,
});
</script>
