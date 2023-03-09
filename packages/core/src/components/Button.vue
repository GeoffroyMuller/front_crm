<template>
  <!-- :class="variant === 'text' ? `button-text button-text-${color}` : `button-${color}`" -->
  <component
    :is="component"
    class="button"
    :class="{
      [`button-text button-text-${color}`]: variant === 'text',
      [`button-outlined button-outlined-${color}`]: variant === 'outlined',
      [`button-${color}`]: variant !== 'text',
      'align-end': align === 'end',
      'align-start': align === 'start',
    }"
    :disabled="disabled || loading"
    v-bind="buttonAdditionnalProps"
  >
    <Icon
      :name="icon"
      v-if="icon"
      :class="{ 'content-icon': !!$slots.default }"
    />
    <span v-if="$slots.default"> <slot /></span>

    <Spinner
      size="sm"
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
interface ButtonProps {
  color?: Color;
  disabled?: boolean;
  loading?: boolean;
  variant?: "base" | "text" | "outlined";
  type?: "button" | "submit";

  align?: "center" | "end" | "start";
  icon?: IconName;
  component?: "button" | "a";
  href?: string;
}

const props = withDefaults(defineProps<ButtonProps>(), {
  color: "primary",
  variant: "base",
  type: "button",
  align: "center",
  component: "button",
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

<style lang="scss" scoped>
.button {
  padding: spacing(0.5) spacing(1.5);
  border: none;
  border-radius: map-deep-get($rounded, "sm");
  min-height: 33px;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.15s ease, color 0.05s linear;
  user-select: none;
  text-decoration: none;
  @include typo(text);
  &:not(.button-text):not(.button-outlined):not(:disabled) {
    box-shadow: 0px 0.3px 0.9px rgba(0, 0, 0, 0.32),
      0px 1.6px 3.6px rgba(0, 0, 0, 0.28);
  }
  &:not(.button-text) .content-icon {
    margin-left: spacing(-0.75);
  }
  display: flex;
  align-items: center;
  gap: spacing(1);
  &.align-end {
    align-items: flex-end;
  }

  &.align-start {
    align-items: flex-start;
  }

  gap: spacing(1);

  &:not(:disabled) {
    cursor: pointer;
  }
  &:disabled {
    cursor: not-allowed;
  }
}

.button-black,
.button-white {
  background-color: #9ca3af;
  color: white;
  &:hover {
    background-color: #6b7280;
  }
}

@each $key, $value in $colors {
  @if type-of($value) == "map" {
    .button-#{$key} {
      background: map-deep-get($value, 500);
      background: linear-gradient(
        245deg,
        map-deep-get($value, 500) 0%,
        map-deep-get($value, 400) 100%
      );
      color: white;

      &:hover:not(:disabled) {
        background: map-deep-get($value, 600);
        background: linear-gradient(
          245deg,
          map-deep-get($value, 600) 0%,
          map-deep-get($value, 500) 100%
        );
      }

      &:disabled {
        background: map-deep-get($value, 200);
      }
    }
  }
}

.button-text {
  background-color: transparent;
  color: color("black");
  position: relative;
  padding: 0;
  min-height: 0;
  &:hover {
    color: color("black");
  }
  gap: spacing(0.5);
}

@each $key, $value in $colors {
  @if type-of($value) == "map" {
    .button-text-#{$key} {
      color: map-deep-get($value, 500);

      &:hover:not(:disabled) {
        color: map-deep-get($value, 700);
        text-shadow: map-deep-get($value, 50) 1px 0 10px;
      }

      &:disabled {
        color: map-deep-get($value, 200);
      }
    }
  }
}

.button-outlined {
  background-color: transparent;
  position: relative;
  color: #6b7280;
  border: solid 1px #6b7280;
}

@each $key, $value in $colors {
  @if type-of($value) == "map" {
    .button-outlined-#{$key} {
      color: map-deep-get($value, 500);
      background-color: transparent;
      border: solid 1px map-deep-get($value, 500);

      &:hover:not(:disabled) {
        color: color("white");
        background-color: map-deep-get($value, 500);
      }

      &:disabled {
        color: map-deep-get($value, 300);
        background-color: transparent;
        border: solid 1px map-deep-get($value, 300);
      }
    }
  }
}
</style>
