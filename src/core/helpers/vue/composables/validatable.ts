import {
  inject,
  ref,
  watch,
  getCurrentInstance,
  onMounted,
  onUnmounted,
} from "vue";

import { isNil } from "lodash";
import { ValidationError, type AnySchema } from "yup";

interface ValidatableProps<T> {
  value?: T;
  error?: boolean | string;
  rules?: AnySchema;
}

export default function useValidatable<T>(props: ValidatableProps<T>) {
  const instance = getCurrentInstance();
  const form = inject<any>("form");

  const internalValue = ref<T | undefined>(props.value);
  const internalError = ref<string | boolean | undefined>(props.error);

  async function validate() {
    let valid = true;
    if (props.rules != null) {
      try {
        await props.rules.validate(internalValue.value);
        internalError.value = undefined;
        valid = true;
      } catch (err) {
        valid = false;
        if (err instanceof ValidationError) {
          internalError.value = err.message;
        } else {
          throw err;
        }
      }
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
        setValue: (val: any) => (internalValue.value = val),
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
      if (val != internalValue.value) internalValue.value = val;
    },
    { immediate: true }
  );

  return {
    validate,
    internalValue,
    internalError,
  };
}
