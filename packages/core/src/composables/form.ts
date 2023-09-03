import {
  clone,
  isEmpty,
  omitBy,
  isNil,
  isEqual,
  get,
  set,
  cloneDeep,
} from "lodash";
import { computed, provide, ref, watch, type Ref } from "vue";

export interface _CustomInput {
  name: string;
  internalValue: any;
  internalError: any;
  validate: () => boolean | string;
}
export interface useFormProps {
  value?: Ref<any>;
  initialValue: Ref<any>;
  onUpdateValue?: (value: any) => void;
  onInputChange?: (val: { name: string; value: any; formValue: any }) => void;
  onUpdateHasChanged?: (val: boolean) => void
}

export default function useForm(props: useFormProps) {
  const inputs = ref<{ [key: string]: _CustomInput }>({});
  const errors = ref<{ [key: string]: string | boolean | undefined }>({});
  const internalValue =
    props.value != null
      ? computed({
          get() {
            return props.value?.value;
          },
          set(val) {
            if (props.onUpdateValue) {
              props.onUpdateValue(val);
            }
          },
        })
      : ref<any>(cloneDeep(props.initialValue.value || {}));
  const internalInitialValue = ref<any>(
    cloneDeep(props.initialValue.value || {})
  );

  function _setInternalValue(name: string, value: any) {
    const newVal = set(cloneDeep(internalValue.value), name, value);
    internalValue.value = newVal;
    if (props.value == null && props.onUpdateValue) {
      props.onUpdateValue(newVal);
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

  function _setInternalValueObject(value: any) {
    internalValue.value = cloneDeep(value || {});
    if (!isEmpty(internalValue.value)) {
      Object.keys(inputs.value).forEach((key) => {
        const inputVal = _getInternalValue(key);
        if (inputVal !== undefined) {
          inputs.value[key].internalValue = inputVal;
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
  }

  watch(
    () => props.initialValue.value,
    () => {
      _setInternalValueObject(props.initialValue.value || {});
      internalInitialValue.value = cloneDeep(props.initialValue.value || {});
    }
  );

  const hasChanged = computed(() => {
    const changed = !isEqual(internalValue.value, internalInitialValue.value);
    props?.onUpdateHasChanged?.(changed);
    return changed;
  });

  function register(input: _CustomInput) {
    inputs.value[input.name] = input;
    if (_getInternalValue(input.name) !== undefined) {
      input.internalValue.value = cloneDeep(_getInternalValue(input.name));
    }
    if (input.internalValue.value !== undefined) {
      _setInternalValue(input.name, cloneDeep(input.internalValue.value));
    }
    if (input.internalError.value !== undefined) {
      errors.value[input.name] = cloneDeep(input.internalError.value);
    }
    watch(
      () => input.internalValue.value,
      () => {
        _setInternalValue(input.name, cloneDeep(input.internalValue.value));
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

  function resetHasChanged() {
    internalInitialValue.value = cloneDeep(internalValue.value);
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
    resetHasChanged,
    validate,
    hasError,
    hasChanged,
    register,
    unregister,
  };
}
