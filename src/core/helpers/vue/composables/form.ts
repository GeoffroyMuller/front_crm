import { clone, isEmpty, omitBy, isNil, isEqual, get, set } from "lodash";
import {
  computed,
  getCurrentInstance,
  provide,
  ref,
  watch,
  type Ref,
} from "vue";

export interface _CustomInput {
  name: string;
  internalValue: any;
  internalError: any;
  validate: () => boolean | string;
}
export interface userFormProps {
  value: Ref<any>;
  onUpdateValue?: (value: any) => void;
  onInputChange?: (val: { name: string; value: any; formValue: any }) => void;
}

export default function useForm(props: userFormProps) {
  const inputs = ref<{ [key: string]: _CustomInput }>({});
  const errors = ref<{ [key: string]: string | boolean | undefined }>({});
  const internalValue = ref<any>(props.value.value);

  function _setInternalValue(name: string, value: any) {
    internalValue.value = set(internalValue.value, name, value);
    if (props.onUpdateValue) {
      props.onUpdateValue(internalValue.value);
    }
    if (props.onInputChange) {
      props.onInputChange({
        name,
        value,
        formValue: internalValue.value,
      });
    }
  }

  function _getInternalValue(name: string) {
    return get(internalValue.value, name);
  }

  watch(
    () => props.value.value,
    () => {
      internalValue.value = clone(props.value.value || {});
      if (!isEmpty(internalValue.value)) {
        Object.keys(inputs.value).forEach((key) => {
          if (_getInternalValue(key) !== undefined) {
            inputs.value[key].internalValue = _getInternalValue(key);
          } else {
            inputs.value[key].internalValue = undefined;
            inputs.value[key].internalError = undefined;
            errors.value[key] = undefined;
          }
        });
      } else {
        Object.keys(inputs.value).forEach((key) => {
          inputs.value[key].internalValue = undefined;
          inputs.value[key].internalError = undefined;
          errors.value[key] = undefined;
        });
      }
    },
    {
      immediate: true,
    }
  );

  const hasChanged = computed(() => {
    return !isEqual(internalValue.value, props.value.value);
  });

  function register(input: _CustomInput) {
    inputs.value[input.name] = input;
    if (_getInternalValue(input.name) !== undefined) {
      input.internalValue.value = clone(_getInternalValue(input.name));
    }
    if (input.internalValue.value !== undefined) {
      _setInternalValue(input.name, clone(input.internalValue.value));
    }
    if (input.internalError.value !== undefined) {
      errors.value[input.name] = clone(input.internalError.value);
    }
    watch(
      () => input.internalValue.value,
      () => {
        _setInternalValue(input.name, clone(input.internalValue.value));
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
    _setInternalValue(name, undefined);
  }

  async function validate() {
    return await Object.keys(inputs.value).reduce(async (prev, currentKey) => {
      const input: _CustomInput = inputs.value[currentKey];
      try {
        // @ts-ignore
        const valid = await input.validate();

        if (!valid || typeof valid === "string") {
          // @ts-ignore
          errors.value[input.name] = valid === false ? true : valid;
          return false;
        }
        return (await prev) && valid;
      } catch (err) {
        console.error(err);
        return await prev;
      }
    }, new Promise((resolve) => resolve(true)));
  }

  const hasError = computed(
    () => !isEmpty(omitBy(omitBy(errors.value, isNil), (v) => v === false))
  );

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
    register,
    unregister,
  };
}
