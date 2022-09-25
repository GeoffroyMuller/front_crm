<template>
  <Teleport to="body" v-if="open">
    <div
      class="container"
      :class="{ 'no-padding': !withPadding }"
      @click="$emit('update:open', false)"
    ></div>
    <div class="modal">
      <slot />
    </div>
  </Teleport>
</template>
<script lang="ts" setup>
import { withDefaults, defineProps, defineEmits } from "vue";

interface ModalProps {
  open: boolean;
  withPadding?: boolean;
  withCloseBtn?: boolean;
}

const props = withDefaults(defineProps<ModalProps>(), {
  withPadding: true,
  withCloseBtn: true,
});

const emit = defineEmits(["update:open"]);
</script>

<style lang="scss" scoped>
.container {
  position: absolute;
  background-color: black;
  opacity: 0.4;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
}
.modal {
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translateX(-50%);
  background-color: white;
  border-radius: map-deep-get($rounded, "md");
  opacity: 1;
  z-index: 5;
  padding: spacing(1.5) spacing(3);
  & .no-padding {
    padding: 0;
  }
}
</style>
