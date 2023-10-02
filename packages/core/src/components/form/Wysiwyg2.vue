<template>
  <div>
    <label @click="editor.focus()" v-if="label">{{ label }}</label>
    <div
      ref="editorWrapperRef"
      class="wysiwyg-editor relative min-h-[100px] rounded-sm z-20 px-3 py-2 transition-[box-shadow_border-color] duration-200 border border-solid focus-within:border-primary-300 focus-within:shadow-[0_0_1pt_0.5pt] focus-within:shadow-primary-200 border-input"
      :class="{
        'mt-2': label?.length,
      }"
      @click="editor.focus()"
    >
      <div ref="editorRef" />
      <div
        class="wysiwyg-editor-toolbar absolute bottom-0 left-0 w-full flex items-center p-2"
      >
        <IconButton
          name="format_bold"
          @click.stop="editor.format('bold', true)"
          class="-m-iconButtonPadding mr-0"
          color="primary"
        />
        <IconButton
          name="format_italic"
          @click.stop="editor.format('italic', true)"
          class="-m-iconButtonPadding mr-0"
          color="primary"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { ref } from "vue";
import Quill from "quill";
import IconButton from "../IconButton.vue";
import { watch } from "vue";

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
      toolbar: false,
    },
    readOnly: false,
    theme: "bubble",
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
  cursor: text;
  .wysiwyg-editor-toolbar {
    cursor: text;
    @apply transition-opacity duration-200;
    opacity: 0;
  }
  &:hover,
  &:focus,
  &:focus-within {
    .wysiwyg-editor-toolbar {
      opacity: 1;
    }
  }
}
.ql-editor {
  // padding: 0;
  padding-left: 0;
  padding-right: 0;
  padding-bottom: 50px;
  outline: none;
  &:focus {
    outline: none;
  }
}
</style>
