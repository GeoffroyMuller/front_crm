<template>
  <div class="grid gap-2">
    <label v-if="label">
      {{ label }}
    </label>
    <div
      ref="dropzoneRef"
      tabindex="0"
      class="selectable-black min-h-input relative flex items-center justify-center gap-2 p-4 typo-title5 text-slate-400 cursor-pointer"
      :class="{
        'border border-dashed border-slate-400': variant === 'base',
        [`rounded-${rounded}`]: true,
        'hover': dragover
      }"
    >
      <Icon class="select-none pointer-events-none" v-if="!fileAdded" name="file_upload" size="sm" />
      <span class="select-none pointer-events-none" v-if="!fileAdded">{{ placeholder || $t("core.import") }}</span>
    </div>
    <!--  <input
      ref="internalRef"
      @focus="onFocus()"
      @blur="onBlur()"
      @input="onInput($event)"
      class="hidden"
      type="file"
    /> -->
  </div>
</template>

<script setup lang="ts">
import type { AnySchema } from "yup/lib/schema";
import type { IconName, Size } from "../../types";
import useValidatable from "../../../composables/validatable";
import Icon from "../../Icon.vue";
import { Dropzone } from "dropzone";
import { onMounted, ref } from "vue";

export interface InputFileProps {
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

  path?: string;
  headers?: any;
}
const props = withDefaults(defineProps<InputFileProps>(), {
  rounded: "md",
  placeholder: "",
  variant: "base",
});
const emit = defineEmits([
  "update:modelValue",
  "update:error",
  "blur",
  "focus",
  "input",
  "change",

  'complete',
  'addedfile'
]);

const dropzoneRef = ref();
const dragover = ref(false);
const fileAdded = ref(false);

onMounted(() => {
  const dropzone = new Dropzone(dropzoneRef.value, {
    url: props.path,
    headers: props.headers,

  });
  dropzone.on("complete", function (file) {
    emit('complete', file);
  });
  dropzone.on("addedfile", function (file) {
    emit('addedfile', file);
    fileAdded.value = true;
  });


  dropzone.on("dragover", function () {
    dragover.value = true;
  });
  dropzone.on("dragleave", function () {
    dragover.value = false;
  });
  dropzone.on("dragend", function () {
    dragover.value = false;
  });
  dropzone.on("drop", function () {
    dragover.value = false;
  });
});

const { internalValue, internalError, validate } = useValidatable({
  value: props.modelValue,
  error: props.error,
  rules: props.rules,
});
</script>

<style>
.dz-success-mark, .dz-error-mark {
  display: none !important;
}
</style>
