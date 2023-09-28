<template>
  <div class="radio-group typo-label">
    <label v-if="label">
      {{ label }}
    </label>
    <div class="radio-buttons">
      <div
        class="radio-button"
        :class="{
          selected: isSelected(opt),
          error: internalError || error,
          disabled: disabled,
        }"
        v-for="opt of options"
        :key="getOptionValue(opt)"
        @click="handleClickOption(opt)"
      >
        <span aria-hidden="true" class="btn">
          <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
            <path
              v-if="isSelected(opt)"
              d="M12,20C7.58,20 4,16.42 4,12C4,7.58 7.58,4 12,4C16.42,4 20,7.58 20,12C20,16.42 16.42,20 12,20M12,2C6.48,2 2,6.48 2,12C2,17.52 6.48,22 12,22C17.52,22 22,17.52 22,12C22,6.48 17.52,2 12,2M12,7C9.24,7 7,9.24 7,12C7,14.76 9.24,17 12,17C14.76,17 17,14.76 17,12C17,9.24 14.76,7 12,7Z"
            ></path>
            <path
              v-else
              d="M12,20C7.58,20 4,16.42 4,12C4,7.58 7.58,4 12,4C16.42,4 20,7.58 20,12C20,16.42 16.42,20 12,20M12,2C6.48,2 2,6.48 2,12C2,17.52 6.48,22 12,22C17.52,22 22,17.52 22,12C22,6.48 17.52,2 12,2Z"
            ></path>
          </svg>
        </span>
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
import useValidatable from "../../composables/validatable";
import { ref } from "vue";

import { isEqual } from "lodash";
import Alert from "../Alert.vue";
import type { AnySchema } from "yup";

export interface RadioGroupProps  {
  multiple?: boolean;

  getOptionValue?: (opt: any) => any;
  getOptionLabel?: (opt: any) => string;

  options: Array<any>;

  autoFilter?: boolean;

  
  label?: string;
  modelValue?: any;
  readonly?: boolean;
  name?: string;
  error?: string | boolean;
  disabled?: boolean;
  rules?: AnySchema;
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
  if (props.disabled) return;

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
        $size: spacing(2.3);
        width: $size;
        height: $size;
        svg {
          width: 100%;
          fill: #d1d5db;
        }
      }
      &.error:not(.disabled) {
        svg {
          fill: color("danger", 500);
        }
      }
      &.selected:not(.disabled) {
        color: color("primary", 500);
        svg {
          fill: color("primary", 500);
        }
      }
    }
  }
}
</style>
