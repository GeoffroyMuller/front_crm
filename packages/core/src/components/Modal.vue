<template>
  <Teleport to="body">
    <div class="fixed top-0 left-0 w-screen h-screen bg-black transition-opacity z-modal duration-300" :class="{
      'no-padding': !withPadding,
      'opacity-[0.4]': open,
      'opacity-0 pointer-events-none': !open,
    }" @click.stop="$emit('update:open', false)"></div>
    <Card
      class="max-md:w-[95%] fixed top-1/2 left-1/2 min-w-[50%] transform -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300"
      :class="{
        'z-modal opacity-100': open,
        'opacity-0 pointer-events-none': !open,
      }" @click.stop>
      <CardHead class="!pb-0" v-if="title?.length" :title="title" :subtitle="subtitle" />
      <CardContent>
        <slot />
      </CardContent>
      <IconButton @click.stop="$emit('update:open', false)" name="close" class="absolute -top-1 right-0 p-card"
        size="xl" />
    </Card>
  </Teleport>
</template>
<script lang="ts" setup>
import { withDefaults } from "vue";
import Card from "./card/Card.vue";
import IconButton from "./IconButton.vue";
import CardHead from "./card/CardHead.vue";
import CardContent from "./card/CardContent.vue";

interface ModalProps {
  open: boolean;
  withPadding?: boolean;
  withCloseBtn?: boolean;

  title?: string;
  subtitle?: string;
}

const props = withDefaults(defineProps<ModalProps>(), {
  withPadding: true,
  withCloseBtn: true,
});

const emit = defineEmits(["update:open"]);
</script>
