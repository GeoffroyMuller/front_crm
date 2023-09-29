<template>
  <div class="relative" ref="editorWrapperElement">
    <label v-if="label">
      {{ label }}
    </label>
    <div
      ref="editorElement"
      class="rounded-sm px-3 py-2 transition-[box-shadow_border-color] duration-200 border border-solid focus-within:border-primary-300 focus-within:shadow-[0_0_1pt_0.5pt] focus-within:shadow-primary-200 border-input"
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
    <div class="absolute bottom-0 left-0 p-2 flex items-center gap-1">
      <ActionMenu :actions="addActions" alignment="start">
        <IconButton name="add" />
      </ActionMenu>
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
import IconButton from "../IconButton.vue";
import ActionMenu, { type Action } from "../ActionMenu.vue";

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
    if (!editor.value) return;
    const data = await editor.value.save();
    internalValue.value = JSON.stringify(data).trim();
  }
  const e = new EditorJS({
    holder: editorElement.value,
    minHeight: 80,
    onChange: (api, event) => {
      handleEditorChange();
    },
    onReady: () => {
      watch(
        () => internalValue.value,
        async () => {
          if (editorWrapperElement.value == null) return;
          if (internalValue.value == null) return;
          const editorHasFocus = editorWrapperElement.value.contains(
            document.activeElement
          );
          if (!editorHasFocus) {
            e.render(JSON.parse(internalValue.value));
          }
        },
        {
          immediate: true,
        }
      );
    },
  });
  editor.value = e;
});

async function add(type = "paragraph") {
  const block = await editor.value?.blocks.insert(type, { autoFocus: true });
  if (!block || !block.holder.parentElement) return;

  const blockIndex = Array.from(block.holder.parentElement.children).findIndex(
    // @ts-ignore
    (elem) => elem?.dataset?.id === block.id
  );
  if (blockIndex === -1) {
    editor.value?.caret.setToLastBlock();
  } else {
    editor.value?.caret.setToBlock(blockIndex);
  }
}

const addActions: Action[] = [
  {
    action: () => add("paragraph"),
    title: "Paragraph",
    icon: "format_paragraph",
  },
];
</script>

<style lang="scss">
.ce-toolbar__actions {
  display: none;
}
.ce-inline-toolbar {
  @apply shadow rounded-sm p-px border-none;
}
.ce-block__content {
  max-width: none;
  margin: 0;
}
.cdx-block {
  padding-top: 0;
  padding-bottom: 2px;
}
</style>
