<template>
  <div @click="editor.focus()">
    <label v-if="label">{{ label }}</label>
    <div
      ref="editorWrapperRef"
      class="min-h-[100px] rounded-sm z-20 px-3 py-2 transition-[box-shadow_border-color] duration-200 border border-solid focus-within:border-primary-300 focus-within:shadow-[0_0_1pt_0.5pt] focus-within:shadow-primary-200 border-input"
      :class="{
        'mt-2': label?.length,
      }"
    >
      <div ref="editorRef" />
      <div ref="toolbarRef">
        <button class="ql-bold"></button>
        <button class="ql-italic"></button>
        <IconButton name="format_bold" @click="editor.format('bold')" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { ref } from "vue";
import Quill from "quill";
import IconButton from "../IconButton.vue";

export type WysiwygProps = {
  label?: string;
};

defineProps<WysiwygProps>();

const editorRef = ref<HTMLDivElement>();
const editorWrapperRef = ref<HTMLDivElement>();
const toolbarRef = ref<HTMLDivElement>();
const editor = ref<Quill>();

onMounted(() => {
  const e = new Quill(editorRef.value, {
    debug: "info",
    bound: editorWrapperRef.value,

    modules: {
      toolbar: {
        container: toolbarRef.value,
      },
    },
    placeholder: "",
    readOnly: false,
    theme: "bubble",
  });
  editor.value = e;
});
</script>

<style lang="scss">
.ql-editor {
  padding: 0;
}
.ql-toolbar {
  @apply bg-white border border-solid border-slate-200 rounded-md;
}
.ql-tooltip-arrow {
  display: none !important;
}
</style>
