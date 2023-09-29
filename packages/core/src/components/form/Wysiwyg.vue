<template>
  <div class="">
    <label v-if="label">
      {{ label }}
    </label>
    <div
      ref="editorElement"
      class="rounded-sm px-2 py-1 transition-[box-shadow_border-color] duration-200 border border-solid focus-within:border-primary-300 focus-within:shadow-[0_0_1pt_0.5pt] focus-within:shadow-primary-200 border-input"
      :class="[
        {
          'border-danger-400 focus-within:shadow-[0_0_2pt_0.5pt] focus-within:shadow-danger-200':
            internalError || error,
          'focus-within:border-primary-300 focus-within:shadow-[0_0_1pt_0.5pt] focus-within:shadow-primary-200 border-input':
            !internalError && !error,
          [`rounded-${rounded}`]: true,
          'bg-white': !disabled,
          'bg-inputDisabled cursor-not-allowed': disabled,
          'mt-2': label?.length,
        },
      ]"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import EditorJS from "@editorjs/editorjs";
import { onMounted } from "vue";
import useValidatable from "../../composables/validatable";
import type { Size } from "../types";

export type WysiwygProps = {
  name?: string;
  label?: string;
  modelValue?: string;
  error?: string;
  rounded?: Size | "full";
  disabled?: boolean;
};

const props = withDefaults(defineProps<WysiwygProps>(), {});

const { internalValue, internalError } = useValidatable({
  error: props.error,
  value: props.modelValue,
});

const editorElement = ref<HTMLDivElement>();

onMounted(() => {
  if (editorElement.value == null) return;
  const editor = new EditorJS({
    holder: editorElement.value,
    onChange: (api, event) => {
      console.log("Now I know that Editor's content changed!", event);
    },
  });
});
</script>
