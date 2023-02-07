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
import useKeyboardShortcut from "@/core/helpers/vue/composables/keyboardshortcut";

export interface FormProps {
  modelValue?: any;
  shortcuts?: boolean;
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

if (props.shortcuts) {
  useKeyboardShortcut("ctrl+s", (e) => {
    e.preventDefault();
    if (!hasError.value && hasChanged.value) {
      handleSumbit(e);
    }
  });
}
</script>
