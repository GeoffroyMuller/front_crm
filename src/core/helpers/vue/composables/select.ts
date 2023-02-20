import { isEqual } from "lodash";
import { computed, ref, type ComputedRef, type Ref } from "vue";

export interface UseSelectProps {
  value: Ref;
  getOptionValue: (opt: any) => any;
  getOptionLabel: (opt: any) => string;
  multiple: boolean;
  options: Ref<Array<any>> | ComputedRef<Array<any>>;
  open: Ref<boolean>;
  validate: () => void;
}

export default function useSelect(props: UseSelectProps) {
  const selected = computed(() => {
    if (props.multiple) {
      if (!props.value.value?.length) return [];
      return props.value.value.map((v: any) =>
        props.options.value.find((o) => isEqual(props.getOptionValue(o), v))
      );
    }
    return props.options.value.find((o) =>
      isEqual(props.getOptionValue(o), props.value.value)
    );
  });

  function isSelected(opt: any) {
    if (props.multiple) {
      if (!props.value.value?.length) return false;
      return (
        props.value.value.find((v: any) =>
          isEqual(props.getOptionValue(opt), v)
        ) != null
      );
    }
    return isEqual(props.getOptionValue(opt), props.value.value);
  }

  function handleClickOption(opt: any) {
    if (props.multiple) {
      if (isSelected(opt)) {
        props.value.value = props.value.value.filter((v: any) => {
          return !isEqual(props.getOptionValue(opt), v);
        });
      } else {
        if (!props.value.value) props.value.value = [];
        props.value.value = [...props.value.value, props.getOptionValue(opt)];
      }
    } else {
      if (isSelected(opt)) {
        props.value.value = undefined;
      } else {
        props.value.value = props.getOptionValue(opt);
      }
      props.open.value = false;
      activeOption.value = null;
    }
    props.validate();
  }

  const displayed = computed<string>(() => {
    if (props.multiple) {
      return selected.value.map((v: any) => props.getOptionLabel(v)).join(", ");
    }
    if (
      selected.value === null &&
      props.options.value.find((opt) => opt == null) !== undefined
    ) {
      return props.getOptionLabel(selected.value);
    }
    return selected.value != null ? props.getOptionLabel(selected.value) : "";
  });

  function handleClickClose() {
    props.value.value = undefined;
    props.open.value = false;
    activeOption.value = null;
    props.validate();
  }

  const activeOption = ref<number | null>(null);
  function isActive(index: number) {
    return index == activeOption.value;
  }
  function handleKeydown(event: KeyboardEvent) {
    if (!props.open.value) {
      if (event.key === "Enter") {
        event.stopPropagation();
        event.preventDefault();
        props.open.value = true;
        activeOption.value = null;
      }
      return;
    }
    if (props.options.value.length === 0) return;
    if (props.options.value.length === 1) {
      if (event.key === "ArrowUp" || event.key === "ArrowDown") {
        activeOption.value = activeOption.value === 0 ? null : 0;
        return;
      }
    }
    if (event.key === "ArrowDown") {
      if (
        activeOption.value == null ||
        activeOption.value === props.options.value.length - 1
      ) {
        activeOption.value = 0;
      } else {
        activeOption.value = activeOption.value + 1;
      }
    } else if (event.key === "ArrowUp") {
      if (activeOption.value == null || activeOption.value === 0) {
        activeOption.value = props.options.value.length - 1;
      } else {
        activeOption.value = activeOption.value - 1;
      }
    } else if (event.key === "Enter") {
      event.stopPropagation();
      event.preventDefault();
      if (typeof activeOption.value === "number") {
        handleClickOption(props.options.value[activeOption.value]);
        if (!props.multiple) {
          activeOption.value = null;
        }
      } else {
        props.open.value = false;
        activeOption.value = null;
      }
    }
  }

  return {
    selected,
    isSelected,
    displayed,
    handleClickOption,
    handleClickClose,
    handleKeydown,
    isActive,
  };
}
