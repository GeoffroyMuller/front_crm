import {
  inject,
  ref,
  watch,
  getCurrentInstance,
  onMounted,
  onUnmounted,
} from "vue";

import { isNil } from "lodash";
import type { Rules } from "../../rules";

interface ValidatableProps<T> {
  value?: T;
  error?: boolean | string;
  rules?: Rules;
}

export default function useValidatable<T>(props: ValidatableProps<T>) {
  const instance = getCurrentInstance();
  const form = inject<any>("form");

  const internalValue = ref<T | undefined>(props.value);
  const internalError = ref<string | boolean | undefined>(props.error);

  function validate() {
    let valid: string | boolean | null | undefined = true;
    if (props.rules?.length) {
      for (const rule of props.rules) {
        const ruleValid = rule(internalValue.value);
        if (ruleValid === false || typeof ruleValid === "string") {
          valid = ruleValid;
        }
      }
    }

    if (typeof valid === "string" || valid === false) {
      internalError.value = (valid || true) as string | boolean;
    } else {
      internalError.value = undefined;
    }

    return valid;
  }

  if (
    !isNil(form) &&
    !isNil(instance) &&
    (instance?.props.name as unknown as string)?.length
  ) {
    onMounted(() => {
      form?.register({
        name: instance?.props.name,
        getValue: () => internalValue.value,
        getError: () => internalError.value,
        validate,
      });
      const defaultValue =
        form?.defaultValue?.[instance?.props.name as unknown as string];
      if (!isNil(defaultValue)) {
        internalValue.value = defaultValue;
      }
    });

    onUnmounted(() => {
      form?.unregister(instance?.props.name);
    });

    watch(
      () => internalValue.value,
      () => {
        form?.inputChange(instance?.props.name);
      }
    );
    watch(
      () => internalError.value,
      () => {
        form?.inputErrorChange(instance?.props.name);
      }
    );
  }

  watch(
    () => internalValue.value,
    () => {
      validate();
      instance?.emit("update:modelValue", internalValue.value);
    }
  );

  watch(
    () => instance?.props.modelValue,
    (val) => {
      // @ts-ignore
      if (val != internalValue.value) internalValue.value = val as string;
    },
    { immediate: true }
  );

  return {
    validate,
    internalValue,
    internalError,
  };
}
