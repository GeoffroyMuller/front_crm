<template>
  <component :is="component" @submit="handleSumbit">
    <slot
      :hasError="hasError"
      :hasChanged="hasChanged"
      :value="internalValue"
    />
  </component>
</template>

<script lang="ts" setup>
import { toRef } from "vue";
import type { _CustomInput } from "../../composables/form";
import useForm from "../../composables/form";
import useKeyboardShortcut from "../../composables/keyboardshortcut";

export interface FormProps {
  modelValue?: any;
  shortcuts?: boolean;
  initialValue?: any;
  component?: any;
}

const props = withDefaults(defineProps<FormProps>(), {
  initialValue: {},
  component: "form",
});

const emit = defineEmits([
  "update:modelValue",
  "update:hasChanged",
  "submit",
  "inputChange",
]);

const {
  hasError,
  validate,
  getData,
  hasChanged,
  internalValue,
  resetHasChanged,
  /* need to stay here for test purpose
    (see form.test.ts -> should delete corresponding data when unregister an input)
 */
  register,
  unregister,
} = useForm({
  value: props.modelValue ? toRef(props, "modelValue") : undefined,
  initialValue: toRef(props, "initialValue"),
  onUpdateValue(value) {
    emit("update:modelValue", value);
  },
  onInputChange(val) {
    emit("inputChange", val);
  },
  onUpdateHasChanged(val) {
    emit("update:hasChanged", val);
  },
});

async function handleSumbit(event: Event) {
  event.preventDefault();
  if (await validate()) {
    emit(
      "submit",
      ...[
        getData(),
        {
          hasChanged: hasChanged.value,
          hasError: hasError.value,
        },
      ]
    );
    resetHasChanged();
  }
}

if (props.shortcuts) {
  useKeyboardShortcut(["ctrl+s", "command+s"], (e) => {
    e.preventDefault();
    if (!hasError.value && hasChanged.value) {
      handleSumbit(e);
    }
  });
}
</script>
