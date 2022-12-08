<template>
  <div>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { provide, ref } from "vue";
import type { _CustomInput } from "../Form.vue";
import type { ISection } from "./Repetable.vue";

interface RepetableSectionProps {
  value: ISection;
}

const props = withDefaults(defineProps<RepetableSectionProps>(), {});
const emit = defineEmits(["inputChange"]);

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

provide("form", {
  register,
  unregister,
  inputChange,
  inputErrorChange,
  defaultValue: props.value,
});
</script>
