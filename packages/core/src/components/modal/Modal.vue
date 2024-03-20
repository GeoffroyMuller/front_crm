<template>
  <Teleport to="body">
    <div
      class="fixed top-0 left-0 w-screen h-screen bg-black transition-modalbackdrop z-modal duration-300"
      :class="{
        'no-padding': !withPadding,
        'opacity-[0.5]': open,
        'opacity-0 pointer-events-none': !open,
      }"
      @click.stop="$emit('update:open', false)"
    ></div>
    <Card
      class="max-md:w-[95%] fixed top-1/2 left-1/2 md:min-w-[650px] max-w-[98%] max-h-[98%] overflow-auto transform -translate-x-1/2 -translate-y-[calc(50%+16px)] transition-modalbackdrop duration-300 z-modal"
      :class="[{
        'opacity-100': open,
        'opacity-0 pointer-events-none': !open,
      }, $props.class]"
      @click.stop
    >
      <slot />
    </Card>
  </Teleport>
</template>
<script lang="ts" setup>
import { provide, withDefaults } from "vue";
import Card from "../card/Card.vue";
import useKeyboardShortcut from "../../composables/keyboardshortcut";

interface ModalProps {
  open: boolean;
  withPadding?: boolean;
  withCloseBtn?: boolean;

  title?: string;
  subtitle?: string;
  class?: string;
}

const props = withDefaults(defineProps<ModalProps>(), {
  withPadding: true,
  withCloseBtn: true,
});

const emit = defineEmits(["update:open"]);

useKeyboardShortcut("esc", () => {
  emit("update:open", false);
  // @ts-ignore
  document.activeElement?.blur && document.activeElement?.blur();
});

export type ModalInject = {
  close: () => void;
};

provide<ModalInject>("modal", {
  close: () => {
    emit("update:open", false);
  },
});
</script>

<style lang="scss">
.transition-modalbackdrop {
  transition: opacity 225ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
}
</style>
