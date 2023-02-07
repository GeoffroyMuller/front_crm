<template>
  <div
    @click="($refs.internalRef as HTMLInputElement).focus()"
    class="text-field"
    :class="{
      error: internalError || error,
    }"
  >
    <label v-if="label">
      {{ label }}
    </label>
    <div class="input-wrapper">
      <textarea
        v-if="multiline"
        @blur="onBlur"
        v-bind="$props"
        ref="internalRef"
        class="mousetrap"
        v-model="internalValue"
        @focus="onFocus"
        :id="id"
      />
      <input
        @blur="onBlur"
        v-bind="$props"
        class="input-class mousetrap"
        :class="{ 'appearance-none': appearanceNone === true }"
        ref="internalRef"
        v-model="internalValue"
        v-if="!multiline"
        @focus="onFocus"
        @input="(e) => onInput(e)"
        :id="id"
      />
      <div
        v-if="(icon || $slots.icon) && !multiline"
        :class="{ disabled }"
        class="icon-hook"
      >
        <Icon v-if="icon" :name="icon" />
        <slot name="icon" />
      </div>
      <div class="input-content" ref="inputContent">
        <slot name="content" />
      </div>
    </div>
    <Alert
      v-if="
        (internalError || error) && typeof (internalError || error) === 'string'
      "
    >
      {{ internalError || error }}
    </Alert>
  </div>
</template>

<script lang="ts" setup>
import useValidatable from "../../helpers/vue/composables/validatable";
import { defineEmits, defineProps, withDefaults, watch } from "vue";
import type { FormInputProps, IconName } from "../types";
import Icon from "../Icon.vue";
import Alert from "../Alert.vue";
import type { AnySchema } from "yup";

export interface InputProps extends FormInputProps<string | number> {
  icon?: IconName;
  multiline?: boolean;
  /*
  TODO : this is a duplicate of props in FormInputProps<string | number>
        need to found why extends do not work proprely
  */
  label?: string;
  modelValue?: any;
  type?: string;
  step?: number;
  readonly?: boolean;
  name?: string;
  error?: string | boolean;
  disabled?: boolean;
  rules?: AnySchema;
  min?: number | undefined | null;
  max?: number | undefined | null;

  id?: string;
  //hide arrows input number
  appearanceNone?: boolean | null;
}

const props = withDefaults(defineProps<InputProps>(), {
  type: "text",
});
const emit = defineEmits([
  "update:modelValue",
  "update:error",
  "blur",
  "focus",
  "input",
  "change",
]);

function onBlur() {
  validate();
  emit("blur");
}

function onFocus() {
  emit("focus");
}

function onInput(e: InputEvent) {
  emit("input", e);
}
const { internalValue, internalError, validate } = useValidatable({
  value: props.modelValue,
  error: props.error,
  rules: props.rules,
});
</script>

<style lang="scss">
.text-field {
  display: flex;
  flex-direction: column;
  gap: spacing(1);
  width: 100%;
  label {
    @include typo(text2);
  }
  .input-wrapper {
    position: relative;
    .input-content {
    }
  }
  .icon-hook {
    border-radius: 0 map-get($rounded, "sm") map-get($rounded, "sm") 0;
    position: absolute;
    right: 0;
    top: 0;
    height: calc(100% - 2px);
    margin: 1px;
    display: grid;
    place-items: center;
    padding-right: spacing(1);
    background-color: color("white");
    &.disabled {
      background-color: #f0f0f0;
      cursor: not-allowed;
    }
    .icon {
      background-color: transparent;
    }
  }
  input,
  textarea {
    min-height: 33px;
    background-color: color("white");
    border-radius: map-get($rounded, "sm");
    display: block;
    padding: 4px 8px;
    border: 1px solid #d1d5db;
    width: 100%;
    color: color("black");
    transition: border-color 0.5s, box-shadow 0.5s;

    &:disabled {
      background-color: #f0f0f0;
      cursor: not-allowed;
    }

    &:focus {
      outline: none;
      border-color: color("primary", 500);
      box-shadow: 0 0 5pt 0.5pt color("primary", 200);
    }
  }
  textarea {
    padding: spacing(2) spacing(1.5);
    min-height: spacing(12);
    height: auto;
    resize: vertical;
  }
  input {
    height: 35px;
    &.appearance-none {
      /* Firefox */
      -moz-appearance: textfield;

      /* Chrome */
      &::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }

      /* Opéra*/
      &::-o-inner-spin-button {
        -o-appearance: none;
        margin: 0;
      }
    }
  }
  &.error {
    input,
    textarea {
      outline: none;
      border-color: color("danger", 500);
      box-shadow: 0 0 5pt 0.5pt color("danger", 200);
    }
  }
}
</style>
