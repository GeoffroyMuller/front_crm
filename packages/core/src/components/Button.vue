<template>
  <component
    :is="component"
    class="button"
    :class="[
      $props.class,
      `typo-${typo}`,
      {
        [`button-${color} text-white border-none`]:
          variant !== 'text' && variant !== 'outlined',
        [`bg-gradient-245 from-${color}-500 to-${color}-400 hover:from-${color}-600 hover:to-${color}-500 `]:
          variant !== 'text' && variant !== 'outlined' && !disabled && !loading,
        [`bg-${color}-200`]:
          variant !== 'text' && variant !== 'outlined' && (disabled || loading),

        [`button-text button-text-${color} selectable-${color}  border-none font-semibold text-left`]:
          variant === 'text',
        [`text-${color}-400 hover:bg-${color}-50`]:
          variant === 'text' && !disabled && !loading,
        [`text-${color}-200`]: variant === 'text' && (disabled || loading),

        [`button-outlined button-outlined-${color}`]: variant === 'outlined',
        [`text-${color}-500 bg-transparent  border border-solid border-${color}-300 hover:bg-${color}-50 `]:
          variant === 'outlined' && !disabled && !loading,
        [`border border-solid border-${color}-300 text-${color}-300 bg-transparent`]:
          variant === 'outlined' && (disabled || loading),

        'align-end': align === 'end',
        'align-start': align === 'start',
        'w-max': !fullWidth,
        'w-full': fullWidth,
        rounded,
      },
    ]"
    :disabled="disabled || loading"
    v-bind="buttonAdditionnalProps"
  >
    <Icon
      size="sm"
      :name="icon"
      v-if="icon"
      :class="{ 'content-icon': !!$slots.default }"
    />
    <span v-if="$slots.default" class="w-fit flex gap-2 items-center relative">
      <slot
    /></span>

    <Spinner
      size="1rem"
      v-if="loading"
      :color="variant === 'text' || variant === 'outlined' ? color : 'white'"
    />
  </component>
</template>

<script setup lang="ts">
import { computed, withDefaults } from "vue";
import Spinner from "./Spinner.vue";
import type { Color, IconName } from "./types";
import Icon from "./Icon.vue";
import type { Typo } from "core/src/components/types";

export interface ButtonProps {
  color?: Color;
  disabled?: boolean;
  loading?: boolean;
  variant?: "base" | "text" | "outlined";
  type?: "button" | "submit";
  rounded?: boolean;
  align?: "center" | "end" | "start";
  icon?: IconName;
  component?: "button" | "a";
  href?: string;
  typo?: Typo;
  fullWidth?: boolean;
  class?: any;
}

const props = withDefaults(defineProps<ButtonProps>(), {
  color: "primary",
  variant: "base",
  type: "button",
  align: "center",
  component: "button",
  typo: "button",
});

const buttonAdditionnalProps = computed(() => {
  if (props.component === "a") {
    return {
      href: props.href,
    };
  } else if (props.component === "button") {
    return {
      type: props.type,
    };
  }
  return {};
});
</script>

<style lang="postcss" scoped>
.button {
  @apply py-1 px-3 rounded-sm flex items-center justify-center gap-2 select-none min-h-[33px];
  transition: background-color 0.15s ease, color 0.05s linear;
  text-decoration: none;
  &.rounded {
    @apply py-3 px-6 rounded-xl;
  }
  &:not(.button-text):not(.button-outlined):not(:disabled) {
    box-shadow: 0px 0.3px 0.9px rgba(0, 0, 0, 0.32),
      0px 1.6px 3.6px rgba(0, 0, 0, 0.28);
    &:active {
      box-shadow: 0px 0.3px 0.9px rgba(0, 0, 0, 0.22),
        0px 1.6px 3.6px rgba(0, 0, 0, 0.18);
    }
  }
  &:not(.button-text) .content-icon {
    @apply -ml-1.5;
  }
  &.align-end {
    align-items: flex-end;
  }

  &.align-start {
    align-items: flex-start;
  }

  &:not(:disabled) {
    cursor: pointer;
  }
  &:disabled {
    cursor: not-allowed;
  }
}

.button-black {
  @apply text-white bg-[#9ca3af] hover:bg-[#6b7280];
}
.button-white {
  @apply bg-white hover:bg-gray-50 text-black;
}
.button-text {
  @apply gap-1 bg-transparent relative py-iconButtonPadding px-buttonTextPadding;
  span {
    width: max-content;
  }
}
.button-text-white {
  @apply text-white disabled:text-[#9ca3af];
}
.button-text-black {
  @apply text-slate-500 disabled:text-[#9ca3af];
}

.button-outlined {
  position: relative;
}
.button-outlined-white,
.button-outlined-black {
  @apply text-[#6b7280] border-slate-300 border border-solid hover:bg-slate-100 disabled:text-[#6b7280] disabled:bg-transparent;
}
</style>
