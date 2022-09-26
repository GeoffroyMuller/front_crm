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
  error?: boolean | string;
}

export default function useValidatable<T>(props: ValidatableProps<T>) {
  const instance = getCurrentInstance();
  const form = inject<any>("form");

  const internalValue = ref<T | undefined>(props.value);
  const internalError = ref<string | boolean | undefined>(props.error);

  function validate() {
    console.error("--- VALIDATE ---");
    // FAKE
    const valid = internalValue.value?.length ? true : "Un probleme";
    internalError.value =
      valid && typeof valid === "boolean" ? undefined : valid;
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
