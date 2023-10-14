<template>
  <div>
    <label
      @click="!editor?.hasFocus() ? editor?.focus() : () => {}"
      v-if="label"
      >{{ label }}</label
    >
    <div
      ref="editorWrapperRef"
      v-mouse-down-outside="handleBlur"
      class="wysiwyg-editor relative rounded-sm z-20 transition-[box-shadow_border-color] duration-200 border border-solid focus-within:border-primary-300 focus-within:shadow-[0_0_1pt_0.5pt] focus-within:shadow-primary-200"
      :class="{
        'mt-2': label?.length,
        'hover:border-input border-transparent': variant === 'text',
        'border-input': variant !== 'text',
      }"
      @click="!editor?.hasFocus() ? editor?.focus() : () => {}"
    >
      <div ref="editorRef" />
      <div ref="toolbarRef" class="wysiwyg-editor-toolbar">
        <ActionMenu :actions="addActions" alignment="start">
          <IconButton name="add" />
        </ActionMenu>
        <div
          class="h-[15px] border-primary-200 border-r border-solid border-l-0"
        />
        <button class="ql-bold" />
        <button class="ql-italic" />
        <button class="ql-underline" />
        <button class="ql-strike" />
      </div>
      <Card
        class="absolute p-1 flex gap-1 w-fit"
        :class="{
          'opacity-0 invisible select-none pointer-events-none':
            !displayTooltip,
          'opacity-100 transition-opacity duration-200 ease-linear':
            displayTooltip,
        }"
        :style="tooltipStyle"
      >
        <IconButton name="format_h1" @click="formatHeading(1)" />
        <IconButton name="format_h2" @click="formatHeading(2)" />
        <IconButton name="format_h3" @click="formatHeading(3)" />
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { ref } from "vue";
import Quill from "quill";
import IconButton from "../IconButton.vue";
import type { Action } from "../ActionMenu.vue";
import { useI18n } from "vue-i18n";
import ActionMenu from "../ActionMenu.vue";
import Card from "../card/Card.vue";

const toolbarRef = ref<HTMLDivElement>();

const tooltipStyle = ref<Record<string, string | number>>({});
const displayTooltip = ref(false);

const { t } = useI18n();

export type WysiwygProps = {
  label?: string;
  variant?: "base" | "text";
};

withDefaults(defineProps<WysiwygProps>(), {
  variant: "base",
});

const editorRef = ref<HTMLDivElement>();
const editorWrapperRef = ref<HTMLDivElement>();
const editor = ref<Quill>();

function handleBlur() {
  displayTooltip.value = false;
}

function formatHeading(value = 3) {
  if (!editor.value) return;
  const selection = editor.value.getSelection();
  if (!selection) return;
  editor.value.removeFormat(selection.index, selection.length);
  editor.value.setSelection(selection.index + selection.length, 0);
  editor.value.format("header", value);
}

onMounted(() => {
  if (!editorRef.value || !editorWrapperRef.value) return;
  const e = new Quill(editorRef.value, {
    debug: false,
    bounds: editorWrapperRef.value,
    placeholder: "",
    modules: {
      toolbar: toolbarRef.value,
    },
    readOnly: false,
    theme: "snow",
  });
  e.on("text-change", () => {
    displayTooltip.value = false;
  });
  e.on("selection-change", (range, oldRange, source) => {
    if (!range) return;
    if (range.length === 0) {
      displayTooltip.value = false;
      return;
    }
    const selectionBound = e.getBounds(range.index, range.length);
    tooltipStyle.value = {
      left: `${selectionBound.left}px`,
      top: `${selectionBound.bottom}px`,
    };
    displayTooltip.value = true;
  });
  editor.value = e;
});

function addHeading(value = 3) {
  if (!editor.value) return;
  editor.value.setSelection(editor.value.getLength(), 1);
  editor.value.format("header", value);
}

function addParagraph() {
  throw new Error("not implemented");
}

const addActions: Action[] = [
  {
    action: () => addParagraph(),
    title: t("core.wysiwyg.paragraph"),
    icon: "format_paragraph",
  },
  {
    action: () => addHeading(),
    title: t("core.wysiwyg.title"),
    icon: "title",
  },
];
</script>

<style lang="scss">
.wysiwyg-editor {
  :focus {
    border: none !important;
  }
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
    @apply cursor-text flex gap-4 items-center;
    @apply pb-1 pt-10 px-2 transition-opacity duration-200;
    opacity: 0;
    border: none;
    margin: 0;
    button:hover {
      @apply text-primary-400;
      .ql-stroke {
        @apply stroke-primary-400;
      }
      .ql-fill {
        @apply fill-primary-400;
      }
    }
    button.ql-active {
      @apply text-primary-500;
      .ql-stroke {
        @apply stroke-primary-500;
      }
      .ql-fill {
        @apply fill-primary-500;
      }
    }
    button {
      padding: 0;
      width: 20px;
      @apply text-slate-500;
      .ql-stroke {
        @apply stroke-slate-500;
      }
      .ql-fill {
        @apply fill-slate-500;
      }
      svg {
        width: 20px;
      }
    }
  }
  &:hover {
    .wysiwyg-editor-toolbar {
      opacity: 0.3;
    }
  }
  &:focus,
  &:focus-within {
    .wysiwyg-editor-toolbar {
      opacity: 1;
    }
  }
}
</style>
