<template>
  <div
    @click="($refs.internalRef as HTMLInputElement).focus()"
    class="text-field"
    :class="{
      error: internalError || error,
      [`rounded-${rounded}`]: true,
    }"
  >
    <label v-if="label">
      {{ label }}
    </label>
    <div class="input-wrapper">
      <textarea
        v-if="multiline"
        :placeholder="placeholder"
        @blur="onBlur"
        v-bind="$props"
        ref="internalRef"
        class="mousetrap"
        :class="{
          'appearance-none': appearanceNone === true,
          [inputClass]: true,
        }"
        v-model="internalValue"
        @focus="onFocus"
        :id="id"
      />
      <input
        v-if="!multiline"
        :placeholder="placeholder"
        @blur="onBlur"
        v-bind="$props"
        class="input-class mousetrap"
        :class="{
          'appearance-none': appearanceNone === true,
          [inputClass]: true,
        }"
        ref="internalRef"
        v-model="internalValue"
        @focus="onFocus"
        @input="(e) => onInput(e)"
        :id="id"
        v-maska:[maskOptions]
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
import useValidatable from "../../composables/validatable";
import { computed, withDefaults } from "vue";
import type { IconName, Size } from "../types";
import Icon from "../Icon.vue";
import Alert from "../Alert.vue";
import type { AnySchema } from "yup";
import { type MaskOptions, vMaska } from "maska";

export interface InputProps {
  mask?: string | MaskOptions;
  icon?: IconName;
  multiline?: boolean;
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
  placeholder?: string;
  //hide arrows input number
  appearanceNone?: boolean | null;
  rounded?: Size | "full";

  inputClass?: string;
}

const props = withDefaults(defineProps<InputProps>(), {
  type: "text",
  rounded: "sm",
  inputClass: "",
  placeholder: "",
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

const maskOptions = computed<MaskOptions | null>(() => {
  if (props.mask) {
    if (typeof props.mask === "string") {
      return {
        mask: props.mask,
      };
    }
    return props.mask;
  }
  return null;
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
    margin-right: spacing(1);
    background-color: color("white");
    &.disabled {
      background-color: #f0f0f0;
      cursor: not-allowed;
    }
    .icon {
      background-color: transparent;
    }
  }
  @each $key, $value in $rounded {
    &.card-rd-#{$key} {
      border-radius: map-get($rounded, $key);
    }
    &.rounded-#{$key} {
      input,
      textarea {
        border-radius: map-get($rounded, $key);
      }
      .icon-hook {
        border-radius: map-get($rounded, $key);
      }
    }
    &.rounded-full {
      input,
      textarea {
        border-radius: 9999px;
      }
      .icon-hook {
        border-radius: 9999px;
      }
    }
  }

  input,
  textarea {
    &::placeholder {
      color: lighten(color("slate", 400), 18%);
    }
    min-height: $input-min-height;
    background-color: color("white");
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
