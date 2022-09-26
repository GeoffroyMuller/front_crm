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

  if (
    !isNil(form) &&
    !isNil(instance) &&
    (instance?.props.name as unknown as string)?.length
  ) {
    onMounted(() => {
      form?.register(instance);
      const defaultValue =
        form?.defaultValue?.[instance?.props.name as unknown as string];
      if (!isNil(defaultValue)) {
        internalValue.value = defaultValue;
      }
    });

    onUnmounted(() => {
      form?.unregister(instance);
    });

    watch(
      () => internalValue.value,
      () => {
        form?.inputChange(instance, internalValue.value);
      }
    );
  }

  watch(
    () => internalValue.value,
    () => {
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
  };
}
