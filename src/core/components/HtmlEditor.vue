<template>
  <div class="html-editor">
    <label v-if="label">
      {{ label }}
    </label>
    <div class="html-editor-content">
      <TextField type="hidden" ref="textfield" :id="id" :name="name" />
      <trix-editor ref="trixEditorRef" :input="id"></trix-editor>
    </div>
  </div>
</template>

<script setup lang="ts">
import Trix from "trix";
import "trix/dist/trix.css";
import TextField from "./form/TextField.vue";
import { ref, onMounted, toRef } from "vue";

interface HtmlEditorProps {
  name?: string;
  id: string;
  label?: string;
  modelValue?: string;
}

const props = withDefaults(defineProps<HtmlEditorProps>(), {});

const trixEditorRef = ref();
const internalValue = toRef(props, "modelValue");
const textfield = ref();

onMounted(() => {
  if (trixEditorRef.value && textfield.value) {
    trixEditorRef.value.addEventListener("trix-initialize", () => {
      const valueFromForm = textfield.value.$refs.internalRef.value;
      if (valueFromForm.length) {
        trixEditorRef.value.editor.insertHTML(valueFromForm);
      }
      if (internalValue.value?.length) {
        trixEditorRef.value.editor.insertHTML(internalValue.value);
      }
    });
    trixEditorRef.value.addEventListener("trix-change", () => {
      textfield.value.$refs.internalRef.dispatchEvent(new Event("input"));
    });
  }
});

document.addEventListener("trix-before-initialize", (e) => {
  // Change Trix.config if you need
  console.log(Trix.config);
});
</script>

<style lang="scss">
.trix-button-row {
  flex-wrap: wrap !important;
  gap: 0 spacing(2);
}
trix-toolbar .trix-button-group:not(:first-child) {
  margin-left: 0 !important;
}
trix-toolbar .trix-button-group {
  flex-wrap: wrap;
}
trix-editor {
  background-color: white;
  transition: border-color 0.5s, box-shadow 0.5s;
  &:focus {
    outline: none;
    border-color: color("primary", 500);
    box-shadow: 0 0 5pt 0.5pt color("primary", 200);
  }
}
.html-editor {
  display: flex;
  flex-direction: column;
  label {
    @include typo(text2);
  }
  gap: spacing(1);
  .html-editor-content {
  }
}
</style>
