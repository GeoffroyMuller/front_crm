<template>
  <form @submit="handleSumbit">
    <slot />
  </form>
</template>

<script lang="ts" setup>
import { ref, provide, type ComponentInternalInstance, defineEmits } from "vue";

const emit = defineEmits(["submit"]);

const inputs = ref<{ [key: string | number]: ComponentInternalInstance }>({});

function register(input: ComponentInternalInstance) {
  inputs.value[input.uid] = input;
}

function unregister(input: ComponentInternalInstance) {
  delete inputs.value[input.uid];
}

function validate() {
  return Object.keys(inputs.value).reduce((prev, currentKey) => {
    // @ts-ignore
    if (typeof inputs.value[currentKey]?.validate === "function") {
      // @ts-ignore
      return prev && inputs.value[currentKey].validate();
    }
    return prev;
  }, true);
}

function getFormData() {
  // @ts-ignore
  const inputsArray = Object.values(inputs.value);
  return inputsArray.reduce((prev: any, input: ComponentInternalInstance) => {
    if (input.props.name) {
      // @ts-ignore
      return { ...prev, [input.props.name]: input.setupState.internalValue };
    }
    return prev;
  }, {});
}

function handleSumbit(event: Event) {
  event.preventDefault();
  validate();
  emit("submit", getFormData());
}

provide("form", {
  register,
  unregister,
});
</script>
