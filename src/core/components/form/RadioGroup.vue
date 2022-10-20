<template>
  <div class="radio-group">
    <label v-if="label">
      {{ label }}
    </label>
    <div class="radio-buttons">
      <div
        class="radio-button"
        :class="{ selected: isSelected(opt), error: internalError || error }"
        v-for="opt of options"
        :key="getOptionValue(opt)"
        @click="handleClickOption(opt)"
      >
        <div class="btn">
          <div />
        </div>
        <div>
          {{ getOptionLabel(opt) }}
        </div>
      </div>
    </div>
    <Alert v-if="internalError || error">
      {{ internalError || error }}
    </Alert>
  </div>
</template>

<script setup lang="ts">
import type { Rules } from "@/core/helpers/rules";
import useValidatable from "@/core/helpers/vue/composables/validatable";
import { ref } from "vue";
import type { FormInputProps } from "../types";
import { isEqual } from "lodash";
import Alert from "../Alert.vue";

interface RadioGroupProps extends FormInputProps<any> {
  multiple?: boolean;

  getOptionValue?: (opt: any) => any;
  getOptionLabel?: (opt: any) => string;

  options: Array<any>;

  autoFilter?: boolean;

  /*
  TODO : this is a duplicate of props in FormInputProps<string | number>
        need to found why extends do not work proprely
  */
  label?: string;
  modelValue?: any;
  readonly?: boolean;
  name?: string;
  error?: string | boolean;
  disabled?: boolean;
  rules?: Rules;
}

const emit = defineEmits(["update:modelValue", "search"]);

const props = withDefaults(defineProps<RadioGroupProps>(), {
  multiple: false,
  autoFilter: false,
  getOptionLabel: (opt: any) => {
    if (typeof opt === "string" || typeof opt === "number") {
      return opt;
    }
    return opt?.label;
  },
  getOptionValue: (opt: any) => {
    if (typeof opt === "string" || typeof opt === "number") {
      return opt;
    }
    return opt?.value;
  },
});

function isSelected(opt: any) {
  if (props.multiple) {
    return (
      internalValue.value.find((v: any) =>
        props.options.find((o) => isEqual(props.getOptionValue(o), v))
      ) != null
    );
  }
  return isEqual(props.getOptionValue(opt), internalValue.value);
}

const { internalValue, internalError, validate } = useValidatable({
  value: props.modelValue,
  error: props.error,
  rules: props.rules,
});

function handleClickOption(opt: any) {
  if (props.multiple) {
    if (isSelected(opt)) {
      internalValue.value = internalValue.value.filter((v: any) => {
        return !isEqual(props.getOptionValue(opt), v);
      });
    } else {
      internalValue.value.push(props.getOptionValue(opt));
    }
  } else {
    if (isSelected(opt)) {
      internalValue.value = undefined;
    } else {
      internalValue.value = props.getOptionValue(opt);
    }
  }
  validate();
}
</script>
<style lang="scss">
.radio-group {
  @include grid(1, 0, 1);
  .radio-buttons {
    display: flex;
    gap: spacing(2);
    .radio-button {
      cursor: pointer;
      display: grid;
      place-items: center;
      gap: spacing(0.75);
      .btn {
        $size: spacing(1.75);
        width: $size;
        height: $size;
        border-radius: 50%;
        border: solid 1px black;
        display: grid;
        place-items: center;
        > * {
          transition: transform 0.5s ease, opacity 0.2s;
          opacity: 0;
          transform: scale(0);
        }
      }
      &.error {
        color: color("danger", 500);
        .btn {
          border: solid 1px color("danger", 500);
          > * {
            background-color: color("danger", 400);
          }
        }
      }
      &.selected {
        color: color("primary", 500);
        .btn {
          border: solid 1px color("primary", 500);
          > * {
            width: 70%;
            height: 70%;
            border-radius: 50%;
            background-color: color("primary", 500);
            opacity: 100;
            transform: scale(1);
          }
        }
      }
    }
  }
}
</style>
