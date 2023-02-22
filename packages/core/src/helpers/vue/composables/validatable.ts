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
  validate?: () => boolean | Promise<boolean>;
}

export default function useValidatable<T>(props: ValidatableProps<T>) {
  const instance = getCurrentInstance();
  const form = inject<any>("form", () => null);

  const internalValue = ref<T | undefined>(props.value);
  const internalError = ref<string | boolean | undefined>(props.error);

  async function validate() {
    if (props.validate) {
      return await props.validate();
    }
    if (props.rules != null) {
      try {
        await props.rules.validate(internalValue.value);
        internalError.value = undefined;
        return true;
      } catch (err) {
        if (err instanceof ValidationError) {
          internalError.value = err.message;
        } else {
          throw err;
        }
        return false;
      }
    } else {
      internalError.value = undefined;
      return true;
    }
  }

  if (
    !isNil(form?.register) &&
    !isNil(instance) &&
    (instance?.props.name as unknown as string)?.length
  ) {
    onMounted(() => {
      form?.register({
        name: instance?.props.name,
        internalValue,
        internalError,
        validate,
      });
    });

    onUnmounted(() => {
      form?.unregister(instance?.props.name);
    });
  }

  watch(
    () => internalValue.value,
    () => {
      if (internalError.value) {
        validate();
      }
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
