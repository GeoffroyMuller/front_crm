import { clone, isEmpty, omitBy, isNil, isEqual } from "lodash";
import { computed, getCurrentInstance, provide, ref, watch } from "vue";

export interface _CustomInput {
  name: string;
  internalValue: any;
  internalError: any;
  validate: () => boolean | string;
}
export interface userFormProps {
  modelValue?: any;
}

export default function useForm(props: userFormProps) {
  const instance = getCurrentInstance();

  const inputs = ref<{ [key: string]: _CustomInput }>({});
  const errors = ref<{ [key: string]: string | boolean | undefined }>({});
  const internalValue = ref<any>(props.modelValue);

  watch(
    () => props.modelValue,
    () => {
      internalValue.value = clone(props.modelValue || {});
      if (!isEmpty(internalValue.value)) {
        Object.keys(inputs.value).forEach((key) => {
          if (internalValue.value[key] !== undefined) {
            inputs.value[key].internalValue = internalValue.value[key];
          } else {
            inputs.value[key].internalValue = undefined;
            setTimeout(() => {
              inputs.value[key].internalError = undefined;
              errors.value[key] = undefined;
            }, 0);
          }
        });
      } else {
        Object.keys(inputs.value).forEach((key) => {
          inputs.value[key].internalValue = undefined;
          setTimeout(() => {
            inputs.value[key].internalError = undefined;
            errors.value[key] = undefined;
          }, 0);
        });
      }
    },
    {
      immediate: true,
    }
  );
  watch(
    () => internalValue.value,
    () => {
      if (hasChanged.value) {
        instance?.emit("update:modelValue", internalValue.value);
      }
    }
  );

  const hasChanged = computed(() => {
    return !isEqual(internalValue.value, props.modelValue);
  });

  function register(input: _CustomInput) {
    inputs.value[input.name] = input;
    if (internalValue.value[input.name] != null) {
      input.internalValue.value = clone(internalValue.value[input.name]);
    }
    watch(
      () => input.internalValue.value,
      () => {
        internalValue.value = {
          ...internalValue.value,
          [input.name]: input.internalValue.value,
        };
        instance?.emit("inputChange", {
          name: input.name,
          value: input.internalValue.value,
        });
      }
    );
    watch(
      () => input.internalError.value,
      () => {
        errors.value[input.name] = input.internalError.value;
      }
    );
  }

  function unregister(name: string) {
    delete inputs.value[name];
    delete internalValue.value[name];
  }

  async function validate() {
    errors.value = {};

    return await Object.keys(inputs.value).reduce(async (prev, currentKey) => {
      const input: _CustomInput = inputs.value[currentKey];
      try {
        // @ts-ignore
        const valid = await input.validate();

        if (!valid || typeof valid === "string") {
          // @ts-ignore
          errors.value[input.name] = valid;
          return false;
        }
        return (await prev) && valid;
      } catch (err) {
        console.error(err);
        return await prev;
      }
    }, new Promise((resolve) => resolve(true)));
  }

  const hasError = computed(() => !isEmpty(omitBy(errors.value, isNil)));

  function getData() {
    // @ts-ignore
    const inputsArray = Object.values(inputs.value);
    return inputsArray.reduce((prev: any, input: _CustomInput) => {
      if (input.name) {
        return { ...prev, [input.name]: input.internalValue };
      }
      return prev;
    }, {});
  }

  function reset() {
    errors.value = {};
    internalValue.value = {};
    Object.keys(inputs.value).forEach((key) => {
      inputs.value[key].internalValue = undefined;
      setTimeout(() => {
        inputs.value[key].internalError = undefined;
        errors.value[key] = undefined;
      }, 0);
    });
  }

  provide("form", {
    register,
    unregister,
  });

  return {
    getData,
    internalValue,
    errors,
    inputs,
    reset,
    validate,
    hasError,
    hasChanged,
  };
}
