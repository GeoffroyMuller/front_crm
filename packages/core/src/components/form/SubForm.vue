<template>
  <Form
    :component="component"
    @update:model-value="($val) => (internalValue = $val)"
  ></Form>
</template>

<script setup lang="ts">
import useValidatable from "../../composables/validatable";
import type { AnySchema } from "yup";
import Form from "./Form.vue";

export interface SubFormProps {
  modelValue?: any;
  error?: string;
  rules?: AnySchema;
  component?: any;
}

const props = withDefaults(defineProps<SubFormProps>(), {
  component: "div",
});
const emit = defineEmits(["update:modelValue", "update:error"]);

const { internalValue, internalError, validate } = useValidatable({
  value: props.modelValue,
  error: props.error,
  rules: props.rules,
});
</script>
