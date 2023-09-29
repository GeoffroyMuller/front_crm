<template>
  <div class="relative" ref="editorWrapperElement">
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
    <div class="absolute bottom-0 left-0 z-10 p-2">
      <IconButton name="add" @click="handleAdd()" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import EditorJS from "@editorjs/editorjs";
import { onMounted } from "vue";
import useValidatable from "../../composables/validatable";
import type { Size } from "../types";
import { watch } from "vue";
import DragDrop from "editorjs-drag-drop";
import IconButton from "../IconButton.vue";

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
const editorWrapperElement = ref<HTMLDivElement>();
const editor = ref<EditorJS>();

onMounted(() => {
  if (editorElement.value == null) return;
  async function handleEditorChange() {
    const data = await editor.value.save();
    internalValue.value = JSON.stringify(data).trim();
  }
  editor.value = new EditorJS({
    holder: editorElement.value,
    minHeight: 150,
    onChange: (api, event) => {
      handleEditorChange();
    },
    onReady: () => {
      new DragDrop(editor);
      watch(
        () => internalValue.value,
        async () => {
          if (!editor.value) return;
          if (editorWrapperElement.value == null) return;
          if (internalValue.value == null) return;
          const editorHasFocus = editorWrapperElement.value.contains(
            document.activeElement
          );
          if (!editorHasFocus) {
            editor.value.render(JSON.parse(internalValue.value));
          }
        },
        {
          immediate: true,
        }
      );
    },
  });
});

function handleAdd() {
  editor.value?.blocks.insert("paragraph", { text: "blaqsdqsd " });
}
</script>

<style lang="scss">
.ce-toolbar__actions {
  @apply bg-white rounded-sm shadow p-px -mt-px;
  right: calc(100% + 8px);
}
.ce-inline-toolbar {
  @apply shadow rounded-sm p-px border-none;
}
</style>
