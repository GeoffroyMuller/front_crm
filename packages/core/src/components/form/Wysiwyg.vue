<template>
  <div class="wysiwyg" @click="$refs.quill?.getQuill()?.focus?.()">
    <label v-if="label">
      {{ label }}
    </label>
    <div
      class="wysiwyg-content"
      :class="{ 'text-variant': variant === 'text' }"
    >
      <QuillEditor ref="quill" @ready="init" @update:content="handleChange" />
    </div>
  </div>
</template>

<script setup lang="ts">
import useValidatable from "../../composables/validatable";
import { QuillEditor } from "@vueup/vue-quill";
import { ref, watch } from "vue";
import "../../assets/style/vuequill.steelsheet.scss";

interface WysiwygProps {
  name?: string;
  label?: string;
  modelValue?: string;
  error?: string;
  variant?: "text";
}

const props = withDefaults(defineProps<WysiwygProps>(), {});

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

watch(
  () => internalValue.value,
  () => {
    if (
      internalValue.value?.length &&
      internalValue.value != quill.value.getHTML()
    ) {
      quill.value.pasteHTML(internalValue.value);
    }
  }
);

function handleChange() {
  internalValue.value = quill.value.getHTML();
}
</script>

<style lang="scss">
button.ql-active {
  background-color: color("primary", 50) !important;
  color: color("primary", 500) !important;
}
button.ql-active .ql-stroke {
  stroke: color("primary", 500) !important;
}
.wysiwyg {
  height: fit-content;
  display: flex;
  flex-direction: column;
  width: 100%;
  label {
    @include typo(label);
  }
  gap: spacing(1);
  .wysiwyg-content {
    display: flex;
    flex-direction: column-reverse;
    @apply bg-white rounded-sm transition-[box-shadow_border-color_background] duration-200 border border-solid border-input;
    &.text-variant {
      @apply border-transparent;
      &:hover:not(:focus-within) {
        @apply border-input;
      }
    }
    height: fit-content;
    .ql-toolbar {
      opacity: 0;
      visibility: hidden;
      user-select: none;
      border: none;
      transition: opacity 0.2s;
    }
    .ql-container {
      border: none;
    }
    .ql-editor {
      min-height: 120px;
      font-size: 0.875rem;
      color: #334155;
      font-weight: 400;
    }
    &:focus-within {
      box-shadow: 0 0 1pt 0.5pt color("primary", 200);
      border-color: color("primary", 300) !important;
      *:focus-visible {
        border: none !important;
      }
      .ql-toolbar {
        opacity: 100;
        visibility: visible;
        user-select: initial;
      }
    }
  }
}
</style>
