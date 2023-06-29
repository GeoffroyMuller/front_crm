<template>
  <Teleport to="body">
    <div
      class="modal-background"
      :class="{ 'no-padding': !withPadding, open }"
      @click.stop="$emit('update:open', false)"
    ></div>
    <Card class="modal" :class="{ open }">
      <div class="modal-content">
        <slot />
      </div>
      <div>
        <IconButton
          @click.stop="$emit('update:open', false)"
          name="close"
          class="close-button"
          size="xl"
        />
      </div>
    </Card>
  </Teleport>
</template>
<script lang="ts" setup>
import { withDefaults } from "vue";
import Media from "./Media.vue";
import Card from "./card/Card.vue";
import IconButton from "./IconButton.vue";

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
$zIndexModal: 45;

.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  min-width: 50%;
  transform: translate(-50%, -50%);
  z-index: $zIndexModal;
  padding: spacing(3);
  opacity: 1;
}
@include media-down(md) {
  .modal {
    width: 95%;
  }
}

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

.close-button {
  position: absolute;
  top: 0;
  right: 0;
  padding: spacing(0.5);
  z-index: $zIndexModal;
}

.modal-background,
.modal {
  transition: opacity 0.3s, visibility 0.35s;
  &:not(.open) {
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
    .modal-content {
      opacity: 0;
    }
  }
  .modal-content {
    opacity: 1;
  }
}
</style>
