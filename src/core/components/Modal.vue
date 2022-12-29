<template>
  <Teleport to="body" v-if="open">
    <div
      class="modal-background"
      :class="{ 'no-padding': !withPadding }"
      @click="$emit('update:open', false)"
    ></div>
    <Card class="modal">
      <slot />

      <div>
        <IconButton
          @click="$emit('update:open', false)"
          name="close"
          class="close-button"
          size="xl"
        />
      </div>
    </Card>
  </Teleport>
</template>
<script lang="ts" setup>
import { withDefaults, defineProps, defineEmits } from "vue";
import Media from "../Media.vue";
import Card from "./Card.vue";
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

.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  min-width: 50%;
  transform: translate(-50%, -50%);
  z-index: $zIndexModal;
  padding: spacing(3);
}
@include media-down(md) {
  .modal {
    width: 95%;
  }
}
.close-button {
  position: absolute;
  top: 0;
  right: 0;
  padding: spacing(0.5);
  z-index: $zIndexModal;
}
</style>
