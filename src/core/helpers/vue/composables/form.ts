import { computed, ref, onMounted } from "vue";
import type { NamedRules, Rule, Rules } from "../../rules";



// todo: this need to be more typed
export interface useFormProps {
  rules?: NamedRules;
  ref: any;
  initialValue?: any;
}

export default function useForm(props: useFormProps) {
  const errors = ref<{ [key: string]: string }>({});
  const formValues = ref<{ [key: string]: string }>({});

  function reset(): void {
    errors.value = {};
    formValues.value = {};
  }

  function setErrors(data = {}): void {
    errors.value = {
      ...errors.value,
      ...data,
    };
  }

  function _collectFormData(form?: HTMLFormElement) {
    if (!form && !props.ref?.value) {
      throw new Error(`
        \nCannot collect form data
        \nuseForm need a ref or a set of data to validate
      `);
    }
    const formData = new FormData(form || (props.ref.value as HTMLFormElement));
    const formEntries = formData.entries();
    const data = {};
    for (const val of formEntries) {
      // @ts-ignore
      data[val[0]] = val[1];
    }
    formValues.value = {
      ...formValues.value,
      ...data,
    };
  }

  onMounted(() => {
    if (props.initialValue) {
      formValues.value = props.initialValue;
    }
    if (props.ref?.value) {
      props.ref.value.oninput = (event: Event) => {
        _collectFormData();
      };
    }
  });

  function validate() {
    const validationErrors: { [key: string]: string } = {};
    if (props.rules) {
      for (const name of Object.keys(props.rules)) {
        const rule: Rule | Rules = props.rules[name];
        const tests = typeof rule === "function" ? [rule] : rule;
        for (const test of tests) {
          const res = test(formValues.value[name]);
          if (res) {
            // @ts-ignore
            validationErrors[name] = res;
          }
        }
      }
    }
    errors.value = validationErrors;
  }

  const clearErrors = () => {
    errors.value = {};
  };

  const hasError = computed(
    () => !!Object.keys(errors.value).find((key) => !!errors.value[key])
  );

  function onSumbit(callback: (data: any) => void) {
    return (event: Event) => {
      event.preventDefault();

      _collectFormData(event?.target as HTMLFormElement);
      validate();

      callback(formValues.value);
    };
  }

  return {
    reset,
    formValues,
    errors,
    clearErrors,
    onSumbit,
    setErrors,
    hasError,
    validate,
  };
}
