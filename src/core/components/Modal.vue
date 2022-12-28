<template>
  <Teleport to="body" v-if="open">
    <div class="modal-container">
      <div
        class="modal-background"
        :class="{ 'no-padding': !withPadding }"
        @click="$emit('update:open', false)"
      ></div>
      <div class="modal">
        <slot />
      </div>
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
$zIndexModal: 55;
.modal-background {
  position: absolute;
  background-color: black;
  opacity: 0.4;
  width: 100%;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: $zIndexModal;
}
.modal-container {
  z-index: $zIndexModal;
  width: 100%;
  position: absolute;
  height: 100vh;
  display: grid;
  place-items: center;
  .modal {
    background-color: white;
    border-radius: map-deep-get($rounded, "md");
    opacity: 1;
    z-index: $zIndexModal;
    padding: spacing(3);
    max-width: 90%;
    overflow-x: hidden;
    & .no-padding {
      padding: 0;
    }
  }
}
</style>
