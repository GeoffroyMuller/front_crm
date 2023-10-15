<template>
  <div class="select-activator" tabindex="0">
    <slot />
  </div>
</template>

<style lang="scss">
.select-activator {
  @apply p-selectActivatorPadding rounded relative select-none cursor-pointer;
  &::before {
    content: " ";
    @apply transition-opacity opacity-0 absolute top-0 left-0 w-full h-full pointer-events-none transition-all;
  }
  &:hover::before {
    @apply bg-selectable opacity-10 rounded;
  }
}
</style>
