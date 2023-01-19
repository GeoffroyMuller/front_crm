<template>
  <div
    class="datepicker-container"
    ref="datepicker"
    v-click-outside="() => (open = false)"
  >
    <TextField
      :label="label"
      :model-value="displayed"
      :error="internalError || error ? true : false"
      readonly
      :disabled="disabled"
      @focus="isFocus = true"
      @blur="isFocus = false"
      @click="!disabled && (open = true)"
    >
      <template #icon>
        <Icon
          name="calendar_month"
          :color="
            !isFocus ? 'black' : internalError || error ? 'danger' : 'primary'
          "
        />
      </template>
    </TextField>
    <Alert v-if="internalError || error">
      {{ internalError || error }}
    </Alert>
  </div>
</template>
<script setup lang="ts">
import useValidatable from "@/core/helpers/vue/composables/validatable";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { computed, ref } from "vue";
import TextField from "../TextField.vue";
import Alert from "../../Alert.vue";
import Icon from "../../Icon.vue";
import type { AnySchema } from "yup";
import DatepickerContent from "./DatepickerContent.vue";
import useMenu from "@/core/helpers/vue/composables/menu";

export interface DatePickerProps {
  // 0 for sunday, 6 for saturday
  firstDayDisplayIndex?: 0 | 1 | 2 | 3 | 4 | 5 | 6;

  modelValue?: string;
  min?: Dayjs;
  max?: Dayjs;
  label?: string;
  name?: string;
  error?: string;
  rules?: AnySchema;
  disabled?: boolean;
}

const isFocus = ref(false);
const datepicker = ref();

const props = withDefaults(defineProps<DatePickerProps>(), {
  firstDayDisplayIndex: 1,
});

const { internalValue, internalError, validate } = useValidatable({
  value: props.modelValue,
  error: props.error,
  rules: props.rules,
});

const displayed = computed(() => {
  if (!internalValue?.value?.length) {
    return "";
  }
  return dayjs(internalValue.value).format("DD/MM/YYYY");
});

function onSelectDate(date: string) {
  internalValue.value = date;
  validate();
  open.value = false;
}

const { open } = useMenu({
  activator: datepicker,
  component: DatepickerContent,
  openOnHover: false,
  fullActivatorWidth: true,
  componentProps: {
    modelValue: internalValue,
    onUpdate: onSelectDate,
    firstDayDisplayIndex: props.firstDayDisplayIndex,
    min: props.min,
    max: props.max,
  },
});
</script>

<style lang="scss">
.datepicker-container {
  display: grid;
  width: 100%;
  gap: spacing(1);
}
</style>
