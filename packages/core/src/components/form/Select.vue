<template>
  <div class="grid w-full gap-2 h-fit cursor-pointer">
    <Menu
      full-activator-width
      stop-open-on-click-activator
      v-model:open="open"
      :strategy="menuStrategy"
      content-card-class="select-menu max-w-full"
      :card-props="{ rounded: 'sm' }"
    >
      <template #activator>
        <SelectActivator
          @click="open = !open"
          v-if="$slots.activator"
          @keydown="handleKeydown"
          :class="$props.class"
        >
          <slot name="activator" />
        </SelectActivator>
        <TextField
          v-else-if="!$slots.activator && variant !== 'text'"
          :model-value="multiple ? null : displayed"
          readonly
          :disabled="disabled"
          :label="label"
          :error="internalError || error ? true : false"
          @focus="isFocus = true"
          @blur="isFocus = false"
          @click="open = !open"
          @keydown="handleKeydown"
          :class="$props.class"
          input-class="cursor-pointer caret-transparent"
        >
          <template #start>
            <div class="flex items-center" v-if="props.multiple">
              <Chip
                v-for="(opt, index) in options.filter(isSelected)"
                :key="index"
                is-closable
                @close="handleClickOption(opt)"
              >
                {{ getOptionLabel(opt) }}
              </Chip>
            </div>
          </template>

          <template #icon>
            <Icon
              :class="{ 'transform rotate-180': open }"
              class="transition-all duration-100"
              name="expand_more"
              color="black"
            />
          </template>
          <!-- <template #content v-if="multiple">
        {{ internalValue }}
      </template> -->
        </TextField>
        <SelectActivator
          v-else
          @click="open = !open"
          @keydown="handleKeydown"
          :class="$props.class"
        >
          <Text
            typo="title4"
            class="flex items-center font-normal"
            :class="{ 'text-slate-400': internalValue == null && placeholder }"
          >
            <span>
              {{
                internalValue == null && placeholder ? placeholder : displayed
              }}
            </span>
            <Icon
              :name="!open ? 'expand_more' : 'expand_less'"
              weight="bold"
              :color="
                !isFocus
                  ? 'black'
                  : internalError || error
                  ? 'danger'
                  : 'primary'
              "
            />
          </Text>
        </SelectActivator>
      </template>
      <template #content>
        <SelectOptions
          :is-selected="isSelected"
          :is-active="isActive"
          :get-option-value="getOptionValue"
          :get-option-label="getOptionLabel"
          :options="options"
          :multiple="multiple"
          @select="handleClickOption"
        >
          <template v-if="$slots.options" #default="_data">
            <slot name="options" v-bind="_data" />
          </template>
          <template v-if="$slots.option" #option="_data">
            <slot name="option" v-bind="_data" />
          </template>
        </SelectOptions>
      </template>
    </Menu>
    <Alert v-if="internalError || error">
      {{ internalError || error }}
    </Alert>
  </div>
</template>
<script setup lang="ts">
import useValidatable from "../../composables/validatable";
import { ref, toRef, type Component } from "vue";
import TextField from "./TextField.vue";
import Alert from "../Alert.vue";
import Icon from "../Icon.vue";
import type { AnySchema } from "yup";
import IconButton from "../IconButton.vue";
import Menu from "../Menu.vue";
import SelectOptions from "../SelectOptions.vue";
import useSelect from "../../composables/select";
import type { MenuProps } from "src/composables/menu";
import Chip from "../Chip.vue";
import SelectActivator from "../SelectActivator.vue";
import Text from "../Text.vue";

export interface SelectProps {
  multiple?: boolean;

  getOptionValue?: (opt: any) => any;
  getOptionLabel?: (opt: any) => string;

  options: Array<any>;

  option?: Component;

  required?: boolean;

  label?: string;
  modelValue?: any;
  readonly?: boolean;
  name?: string;
  error?: string | boolean;
  disabled?: boolean;
  rules?: AnySchema;
  menuStrategy?: MenuProps["strategy"];

  variant?: "base" | "text";

  placeholder?: string;
}

const props = withDefaults(defineProps<SelectProps>(), {
  multiple: false,
  getOptionLabel: (opt: any) => {
    if (typeof opt === "string" || typeof opt === "number" || opt === null) {
      return opt;
    }
    return opt?.label;
  },
  getOptionValue: (opt: any) => {
    if (typeof opt === "string" || typeof opt === "number" || opt === null) {
      return opt;
    }
    return opt?.value;
  },
});
const emit = defineEmits([
  "update:modelValue",
  "update:error",
  "blur",
  "focus",
  "input",
  "change",
]);

const open = ref(false);
const isFocus = ref(false);

const { internalValue, internalError, validate } = useValidatable({
  value: props.modelValue,
  error: props.error,
  rules: props.rules,
});

const {
  isActive,
  handleKeydown,
  isSelected,
  displayed,
  handleClickOption,
  handleClickClose,
} = useSelect({
  value: internalValue,
  getOptionLabel: props.getOptionLabel,
  getOptionValue: props.getOptionValue,
  options: toRef(props, "options"),
  multiple: props.multiple,
  open,
  validate,
});
</script>

<style lang="scss">
.select-menu {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  overflow: hidden;
}
</style>
