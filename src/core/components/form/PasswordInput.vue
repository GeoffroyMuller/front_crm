<template>
  <TextField v-bind="$props" :type="showPassword ? 'text' : 'password'">
    <template #icon>
      <IconButton
        :name="showPassword ? 'visibility' : 'visibility_off'"
        class="password-input-icon"
        @click="showPassword = !showPassword"
      />
    </template>
  </TextField>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { FormInputProps } from "../types";
import TextField from "./TextField.vue";
import IconButton from "../IconButton.vue";
import type { AnySchema } from "yup";

interface PasswordInputProps extends FormInputProps<string | number> {
  /*
  TODO : this is a duplicate of props in FormInputProps<string | number>
        need to found why extends do not work proprely
  */
  label?: string;
  modelValue?: any;
  readonly?: boolean;
  name?: string;
  error?: string | boolean;
  disabled?: boolean;
  rules?: AnySchema;
  min?: number | undefined | null;
  max?: number | undefined | null;
}

const props = withDefaults(defineProps<PasswordInputProps>(), {});

const showPassword = ref(false);
</script>
