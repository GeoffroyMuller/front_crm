<template>
  <div
    :tabindex="selectable ? 0 : -1"
    ref="cardRef"
    @keydown.enter="
      // @ts-ignore
      selectable && $refs?.cardRef?.click()
    "
    class="shadow-card border border-solid transition-[border] duration-200"
    :class="{
      'max-md:p-cardMobile p-card': padding,
      'rounded-sm': rounded === 'sm',
      'rounded-md': rounded === 'md',
      'rounded-lg': rounded === 'lg',
      'rounded-xl': rounded === 'xl',
      'border-slate-200': bordered,
      'cursor-pointer select-none': selectable,
      'hover:border-slate-300': selectable && !selected,
      'border-primary-800': selected,
      'border-transparent': !selected && !bordered,
      'bg-white': !darken,
      'bg-zinc-50': darken,
    }"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { inject, provide, withDefaults } from "vue";
import type { Size } from "../types";
import type { SidebarInject } from "../sidebar/sidebar.types";
export interface CardProps {
  padding?: boolean;
  rounded: Size;
  bordered?: boolean;
  selectable?: boolean;
  selected?: boolean;
  darken?: boolean;
}

export type CardProvide = Pick<CardProps, "padding" | "rounded">;

const props = withDefaults(defineProps<CardProps>(), {
  rounded: "md",
});

provide<CardProvide>("card", {
  padding: props.padding,
  rounded: props.rounded,
});

const cardParent = inject<CardProvide>("card");
const sidebarParent = inject<SidebarInject>("sidebar");
</script>
