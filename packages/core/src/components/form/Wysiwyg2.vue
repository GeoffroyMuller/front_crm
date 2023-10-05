<template>
  <div>
    <label @click="editor?.focus()" v-if="label">{{ label }}</label>
    <div
      ref="editorWrapperRef"
      class="wysiwyg-editor relative rounded-sm z-20 transition-[box-shadow_border-color] duration-200 border border-solid focus-within:border-primary-300 focus-within:shadow-[0_0_1pt_0.5pt] focus-within:shadow-primary-200 border-input"
      :class="{
        'mt-2': label?.length,
      }"
      @click="editor?.focus()"
    >
      <div ref="editorRef" />
      <div ref="toolbarRef" class="wysiwyg-editor-toolbar">
        <button class="ql-bold" />
        <button class="ql-italic" />
        <button class="ql-underline" />
        <button class="ql-strike" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { ref } from "vue";
import Quill from "quill";
import { watch } from "vue";

const toolbarRef = ref<HTMLDivElement>();

export type WysiwygProps = {
  label?: string;
};

defineProps<WysiwygProps>();

const editorRef = ref<HTMLDivElement>();
const editorWrapperRef = ref<HTMLDivElement>();
const editor = ref<Quill>();

onMounted(() => {
  if (!editorRef.value || !editorWrapperRef.value) return;
  const e = new Quill(editorRef.value, {
    debug: "info",
    bounds: editorWrapperRef.value,
    placeholder: "",
    modules: {
      toolbar: toolbarRef.value,
    },
    readOnly: false,
    theme: "snow",
  });
  editor.value = e;
});

watch(
  () => editor.value,
  (val) => console.error({ val }),
  { immediate: true }
);
</script>

<style lang="scss">
.wysiwyg-editor {
  .ql-editor {
    @apply px-3 py-2;
    outline: none;
    &:focus {
      outline: none;
    }
  }
  .ql-container {
    @apply border-0;
  }
  cursor: text;
  .wysiwyg-editor-toolbar {
    @apply cursor-text flex gap-2;
    @apply pb-1 pt-4 px-2 transition-opacity duration-200;
    opacity: 0;
    border: none;
    margin: 0;
    button {
      padding: 0;
      width: 20px;
      svg {
        width: 20px;
      }
    }
  }
  &:hover,
  &:focus,
  &:focus-within {
    .wysiwyg-editor-toolbar {
      opacity: 1;
    }
  }
}
</style>
