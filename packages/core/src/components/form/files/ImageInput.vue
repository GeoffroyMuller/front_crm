<template>
  <div v-if="file">
    <img
      :src="url"
      alt=""
      class="object-contain bg-black w-80 h-80 rounded-sm"
    />
  </div>
  <FileInput v-else v-bind="$props" @input="onInput" />
</template>

<script lang="ts" setup>
import type { AnySchema } from "yup/lib/schema";
import type { IconName, Size } from "../../types";
import FileInput from "./FileInput.vue";
import { ref } from "vue";

export interface ImageInputProps {
  modelValue?: any;
  icon?: IconName;
  rules?: AnySchema;
  label?: string;
  readonly?: boolean;
  name?: string;
  error?: string | boolean;
  disabled?: boolean;

  id?: string;
  placeholder?: string;

  rounded?: Size | "full";

  variant?: "base";
}

const props = defineProps<ImageInputProps>();

const file = ref();
const url = ref("");

function onInput(e: Event) {
  // @ts-ignore
  file.value = e.target.files[0];
  const reader = new FileReader();
  reader.readAsDataURL(file.value);
  reader.onload = function () {
    url.value = reader.result as string;
  };
}
</script>
