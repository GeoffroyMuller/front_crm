<template>
  <div class="wysiwyg-container">
    <label>
      {{ label }}
    </label>
    <div :class="{ [`rounded-${rounded} wysiwyg-content`]: true, }" contenteditable="true">

    </div>
    <Alert v-if="internalError || error">
      {{ internalError || error }}
    </Alert>
  </div>
</template>
<script setup lang="ts">
import useValidatable from "../../composables/validatable";
import useWysiwyg from "../../composables/wysiwyg";
import Alert from "../Alert.vue";
import type { AnySchema } from "yup";
import type { Size } from "../types";
import type { Ref } from "vue";

export interface SwitchProps {
  label?: string;
  modelValue?: string;
  readonly?: boolean;
  name?: string;
  error?: string | boolean;
  disabled?: boolean;
  rules?: AnySchema;
  rounded?: Size;
}

const props = withDefaults(defineProps<SwitchProps>(), {
  rounded: "sm",
});
const emit = defineEmits(["update:modelValue"]);

const { internalValue, internalError, validate } = useValidatable({
  value: props.modelValue,
  error: props.error,
  rules: props.rules,
});

const { execCommand } = useWysiwyg({
  value: internalValue as Ref<string>
});


window.execCommand = execCommand;

</script>

<style lang="scss">
.wysiwyg-container {
  label {
    cursor: pointer;
    @include typo(text2);
  }

  .wysiwyg-content {
    margin-top: spacing(1);
    padding: 4px 8px;
    border: 1px solid #d1d5db;
    width: 100%;
    color: color("black");
    background-color: color("white");
    transition: border-color 0.5s, box-shadow 0.5s;
    min-height: spacing(12);
    &:disabled {
      background-color: #f0f0f0;
      cursor: not-allowed;
    }

    &:focus {
      outline: none;
      border-color: color("primary", 500);
      box-shadow: 0 0 5pt 0.5pt color("primary", 200);

    }

    @each $key,
    $value in $rounded {
      &.rounded-#{$key} {
        border-radius: map-get($rounded, $key);
      }
    }
  }
}
</style>
