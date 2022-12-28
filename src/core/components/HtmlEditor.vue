<template>
  <div class="html-editor">
    <label v-if="label">
      {{ label }}
    </label>
    <div class="html-editor-content">
      <QuillEditor ref="quill" @ready="init" @update:content="handleChange" />
    </div>
  </div>
</template>

<script setup lang="ts">
import useValidatable from "../helpers/vue/composables/validatable";
import { QuillEditor } from "@vueup/vue-quill";
import { ref } from "vue";

interface HtmlEditorProps {
  name?: string;
  label?: string;
  modelValue?: string;
  error?: string;
}

const props = withDefaults(defineProps<HtmlEditorProps>(), {});

const quill = ref();

const { internalValue } = useValidatable({
  error: props.error,
  value: props.modelValue,
});

function init() {
  if (internalValue.value?.length) {
    quill.value.pasteHTML(internalValue.value);
  }
}

function handleChange() {
  internalValue.value = quill.value.getHTML();
}
</script>

<style lang="scss">
.html-editor {
  height: fit-content;
  display: flex;
  flex-direction: column;
  label {
    @include typo(text2);
  }
  gap: spacing(1);
  .html-editor-content {
    &:focus-within {
      .ql-editor {
        border-color: color("primary", 500);
        box-shadow: 0 0 5pt 0.5pt color("primary", 200);
      }
      .ql-toolbar {
        border-color: color("primary", 500);
        box-shadow: 0 0 5pt 0.5pt color("primary", 200);
      }
    }
    height: fit-content;
    .ql-toolbar {
      border-radius: map-get($rounded, "sm") map-get($rounded, "sm") 0 0;
      transition: border-color 0.5s, box-shadow 0.5s;
    }
    .ql-container {
      border: none;
    }
    .ql-editor {
      border: solid 1px #d1d5db;
      border-radius: 0 0 map-get($rounded, "sm") map-get($rounded, "sm");
      border-top: 0;
      transition: border-color 0.5s, box-shadow 0.5s;
      background-color: white;
    }
  }
}
</style>
