<template>
  <form @submit="handleSumbit">
    <slot
      :hasError="hasError"
      :hasChanged="hasChanged"
      :value="internalValue"
    />
  </form>
</template>

<script lang="ts" setup>
import { defineEmits } from "vue";
import type { _CustomInput } from "@/core/helpers/vue/composables/form";
import useForm from "@/core/helpers/vue/composables/form";

export interface FormProps {
  modelValue?: any;
}

const props = withDefaults(defineProps<FormProps>(), {});

const emit = defineEmits(["update:modelValue", "submit", "inputChange"]);

const { hasError, validate, getData, hasChanged, internalValue } =
  useForm(props);

async function handleSumbit(event: Event) {
  event.preventDefault();
  if (await validate()) {
    emit("submit", getData());
  }
}
</script>
