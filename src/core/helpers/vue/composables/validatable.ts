import {
  inject,
  ref,
  watch,
  getCurrentInstance,
  onMounted,
  onUnmounted,
} from "vue";

import { isNil } from "lodash";

interface ValidatableProps<T> {
  value?: T;
}

export default function useValidatable<T>(props: ValidatableProps<T>) {
  const instance = getCurrentInstance();
  const form = inject<any>("form");

  const internalValue = ref<T | undefined>(props.value);

  function validate() {
    console.error("--- VALIDATE ---");
    return true;
  }

  if (!isNil(form) && !isNil(instance)) {
    onMounted(() => {
      form?.register(instance);
    });

    onUnmounted(() => {
      form?.unregister(instance);
    });
  }

  watch(
    () => internalValue.value,
    () => {
      instance?.emit("update:modelValue", internalValue.value);
      instance?.emit("change", internalValue.value);
    }
  );

  return {
    validate,
    internalValue,
  };
}
