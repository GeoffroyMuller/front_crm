<template>
  <div
    @click="($refs.internalRef as HTMLInputElement).focus()"
    class="text-field"
    :class="{
      'w-full': fullWidth,
      error: error,
    }"
  >
    <label v-if="label">
      {{ label }}
    </label>
    <input v-bind="$props" ref="internalRef" v-model="internalValue" />
    <div v-if="error" class="input-error">
      {{ error }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, defineEmits, defineProps, withDefaults, watch } from "vue";

interface InputProps {
  label?: string;
  modelValue?: string | number;
  fullWidth?: boolean;
  readonly?: boolean;
  name?: string;
  error?: string;
}

const props = withDefaults(defineProps<InputProps>(), {
  fullWidth: true,
});
const emit = defineEmits([
  "update:modelValue",
  "update:error",
  "blur",
  "focus",
  "input",
  "change",
]);

const internalValue = ref("");

watch(
  () => props.modelValue,
  (val) => {
    if (val != internalValue.value) internalValue.value = val as string;
  },
  { immediate: true }
);

watch(
  () => internalValue.value,
  (val) => {
    emit("update:modelValue", val);
    emit("update:error", false);
  }
);
</script>

<style lang="scss" scoped>
.text-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  input {
    background-color: white;
    border-radius: map-get($rounded, "sm");
    display: block;
    padding: 4px 8px;
    border: 1px solid #d1d5db;
    width: 100%;
    height: 35px;

    transition: border-color 0.5s, box-shadow 0.5s;

    &:focus {
      outline: none;
      border-color: color("primary", 500);
      box-shadow: 0 0 5pt 0.5pt color("primary", 200);
    }
  }

  &.error {
    input {
      outline: none;
      border-color: color("danger", 500);
      box-shadow: 0 0 5pt 0.5pt color("danger", 200);
    }
  }
}
.input-error {
  color: color("danger", 500);
}
</style>
