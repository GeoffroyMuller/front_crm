<template>
  <div class="select-activator selectable-black" tabindex="0">
    <slot />
  </div>
</template>

<style lang="scss">
.select-activator {
  @apply p-selectActivatorPadding rounded relative select-none cursor-pointer;
}
</style>
