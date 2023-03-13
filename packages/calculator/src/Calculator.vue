<template>
  <div class="calculator">
    <div class="code" ref="code"></div>
    <pre class="results">{{ results }}</pre>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { EditorView, basicSetup } from "codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { gruvboxDark } from "./theme";
import type { ViewUpdate } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import interpreter from "./interpreter";

const props = defineProps<{ value?: string }>();

const code = ref<HTMLElement>();
const results = ref("");
const state = EditorState.create({
  doc: props.value ?? "",
  extensions: [
    basicSetup,
    javascript(),
    gruvboxDark,
    EditorView.updateListener.of((v: ViewUpdate) => {
      computeResult(v.state.doc.toString());
    }),
  ],
});

function computeResult(value: string) {
  results.value = value
    .split("\n")
    .map((line) => {
      const result = interpreter(line);
      return result.parseErrors.length > 0 ? "" : result.value;
    })
    .join("\n");
}

onMounted(() => {
  if (code.value != null) {
    new EditorView({
      state,
      parent: code.value,
    });
  }
});
</script>

<style lang="scss">
$paddingY: 4px;
$paddingLineX: 4px;
.calculator {
  display: grid;
  grid-template-columns: 1fr 1fr;
  overflow-y: auto;
  .code,
  .results {
    margin: 0;
    background: #282828;
    color: #7f9338;
  }
  .results {
    padding-top: $paddingY;
    padding-bottom: $paddingY;
    padding-left: $paddingLineX;
    padding-right: $paddingLineX;
  }
  .code {
    border-right: 1px solid rgb(200, 200, 200);
    .cm-gutters {
      display: none;
    }
    .cm-content {
      padding-top: paddingY;
      padding-bottom: paddingY;
      .cm-line {
        padding-left: $paddingLineX;
        padding-right: $paddingLineX;
      }
    }
  }
}
</style>
