<template>
  <form @submit="handleSumbit">
    <slot :hasError="hasError" />
  </form>
</template>

<script lang="ts" setup>
import { ref, provide, defineEmits, computed, watch } from "vue";
import { isEmpty, omitBy, isNil, clone } from "lodash";

export interface FormProps {
  modelValue?: any;
}

export interface _CustomInput {
  name: string;
  internalValue: any;
  internalError: any;
  validate: () => boolean | string;
}

const props = withDefaults(defineProps<FormProps>(), {});

const emit = defineEmits(["update:modelValue", "submit", "inputChange"]);

const inputs = ref<{ [key: string]: _CustomInput }>({});
const errors = ref<{ [key: string]: string | boolean | undefined }>({});
const internalValue = ref<any>(props.modelValue);

watch(
  () => props.modelValue,
  () => {
    internalValue.value = clone(props.modelValue || {});
    if (!isEmpty(internalValue.value)) {
      Object.keys(inputs.value).forEach((key) => {
        if (internalValue.value[key] != null) {
          inputs.value[key].internalValue = internalValue.value[key];
        } else {
          inputs.value[key].internalValue = undefined;
          setTimeout(() => {
            inputs.value[key].internalError = undefined;
            errors.value[key] = undefined;
          }, 0);
        }
      });
    } else {
      Object.keys(inputs.value).forEach((key) => {
        inputs.value[key].internalValue = undefined;
        setTimeout(() => {
          inputs.value[key].internalError = undefined;
          errors.value[key] = undefined;
        }, 0);
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

function register(input: _CustomInput) {
  inputs.value[input.name] = input;
  if (internalValue.value[input.name] != null) {
    input.internalValue.value = clone(internalValue.value[input.name]);
  }
  watch(
    () => input.internalValue.value,
    () => {
      internalValue.value[input.name] = input.internalValue.value;
      emit("inputChange", {
        name: input.name,
        value: input.internalValue.value,
      });
    }
  );
  watch(
    () => input.internalError.value,
    () => {
      errors.value[input.name] = input.internalError.value;
    }
  );
}

function unregister(name: string) {
  delete inputs.value[name];
  delete internalValue.value[name];
}

async function validate() {
  errors.value = {};

  return await Object.keys(inputs.value).reduce(async (prev, currentKey) => {
    const input: _CustomInput = inputs.value[currentKey];
    try {
      // @ts-ignore
      const valid = await input.validate();

      if (!valid || typeof valid === "string") {
        // @ts-ignore
        errors.value[input.name] = valid;
      }
      return (await prev) && valid;
    } catch (err) {
      console.error(err);
      return await prev;
    }
  }, new Promise((resolve) => resolve(true)));
}

const hasError = computed(() => !isEmpty(omitBy(errors.value, isNil)));

function getFormData() {
  // @ts-ignore
  const inputsArray = Object.values(inputs.value);
  return inputsArray.reduce((prev: any, input: _CustomInput) => {
    if (input.name) {
      return { ...prev, [input.name]: input.internalValue };
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
});
</script>
