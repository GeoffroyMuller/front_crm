<template>
  <div class="grid w-full gap-2">
    <Menu
      full-activator-width
      stop-open-on-click-activator
      v-model:open="open"
      content-card-class="select-menu"
      :card-props="{ rounded: 'sm' }"
    >
      <template #activator>
        <TextField
          v-model="search"
          :disabled="disabled"
          input-class="group/autocomplete"
          :label="label"
          :error="internalError || error ? true : false"
          @focus="isFocus = true"
          @blur="handleBlur"
          @click="clickTextField"
          @keydown="handleKeydown"
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
            <IconButton
              name="close"
              @click.stop="handleClickClose"
              size="xs"
              v-if="internalValue != null && !multiple"
              class="opacity-0 pointer-events-none group-focus-within/autocomplete:opacity-100 group-focus-within/autocomplete:pointer-events-auto group-hover/autocomplete:opacity-100 group-hover/autocomplete:pointer-events-auto"
            />
            <Icon name="search" color="black" />
          </template>
        </TextField>
      </template>
      <template #content>
        <SelectOptions
          :is-selected="isSelected"
          :get-option-value="_getOptionValue"
          :get-option-label="props.getOptionLabel"
          :options="optionsFiltered"
          :multiple="props.multiple"
          @select="handleClickOption"
          :is-active="isActive"
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

    <Alert v-if="typeof (internalError || error) === 'string'">
      {{ internalError || error }}
    </Alert>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import useValidatable from "../../composables/validatable";
import { computed } from "vue";
import TextField from "./TextField.vue";
import { debounce, isEqual } from "lodash";
import Alert from "../Alert.vue";
import Icon from "../Icon.vue";
import type { AnySchema } from "yup";
import IconButton from "../IconButton.vue";
import Menu from "../Menu.vue";
import SelectOptions from "../SelectOptions.vue";
import useSelect from "../../composables/select";
import Chip from "../Chip.vue";

export interface AutocompleteProps {
  multiple?: boolean;

  getOptionLabel?: (opt: any) => string;
  getOptionValue?: (opt: any) => any;

  options: Array<any>;

  autoFilter?: boolean;
  debounce?: number;
  label?: string;
  modelValue?: any;
  readonly?: boolean;
  name?: string;
  error?: string | boolean;
  disabled?: boolean;
  rules?: AnySchema;
}

const emit = defineEmits(["update:modelValue", "search", "update:selected"]);

const props = withDefaults(defineProps<AutocompleteProps>(), {
  multiple: false,
  autoFilter: false,
  getOptionLabel: (opt: any) => {
    if (typeof opt === "string" || typeof opt === "number") {
      return opt;
    }
    return opt?.label;
  },
  debounce: 500,
});

function _getOptionValue(opt: any) {
  if (props.getOptionValue) {
    return props.getOptionValue(opt);
  }
  if (typeof opt === "string" || typeof opt === "number") {
    return opt;
  }
  return opt;
}

const search = ref("");
const isFocus = ref();
const open = ref(false);

const { internalValue, internalError, validate } = useValidatable({
  value: props.modelValue,
  error: props.error,
  rules: props.rules,
});

const optionsFiltered = computed(() => {
  let res: any[] = [];
  if (props.autoFilter) {
    res = props.options.filter((opt: any) =>
      props
        .getOptionLabel(opt)
        .toLowerCase()
        .includes((search.value || "").toLowerCase())
    );
  }
  res = props.options;

  if (storedOpt.value != null) {
    if (
      !props.multiple &&
      !res.find((o) =>
        isEqual(_getOptionValue(o), _getOptionValue(storedOpt.value))
      )
    ) {
      res.push(storedOpt.value);
    }
  }

  return res;
});

const {
  isActive,
  handleKeydown,
  isSelected,
  displayed,
  handleClickOption,
  handleClickClose,
  selected,
} = useSelect({
  value: internalValue,
  getOptionLabel: props.getOptionLabel,
  getOptionValue: _getOptionValue,
  options: optionsFiltered,
  multiple: props.multiple,
  open,
  validate,
});

function clickTextField() {
  if (optionsFiltered.value?.length && search.value?.length) {
    open.value = true;
  }
}

watch(
  () => search.value,
  debounce(() => {
    if (search.value !== displayed.value) {
      emit("search", search.value);
      if (optionsFiltered.value?.length) {
        open.value = true;
      } else {
        open.value = false;
      }
    }
    if (!search.value.length && !props.multiple) {
      open.value = false;
    }
  }, props.debounce)
);

// here to store the option that correspond to the current value
const storedOpt = ref();

watch(
  () => internalValue.value,
  (val) => {
    if (props.multiple) {
      search.value = "";
      if (!internalValue.value.length) {
        open.value = false;
      }
    } else {
      search.value = displayed.value;
    }

    storedOpt.value = selected.value;
    emit("update:selected", selected.value);
  },
  {
    immediate: true,
  }
);

watch(
  () => optionsFiltered.value,
  () => {
    if (optionsFiltered.value?.length) {
      if (isFocus.value) {
        if (search.value?.length) open.value = true;
      } else {
        if (internalValue.value != null && !props.multiple) {
          search.value = displayed.value;
        }
      }
    }
  }
);

function handleBlur() {
  isFocus.value = false;
  if (props.multiple) {
    search.value = "";
  } else {
    search.value = displayed.value;
  }
}
</script>

<style lang="scss">
.select-menu {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  overflow: hidden;
}
</style>
