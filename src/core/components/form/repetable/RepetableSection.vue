<template>
  <div class="repetable-section">
    <div v-if="orderable" class="drag_handle">
      <Icon name="drag_handle"></Icon>
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
import type { _CustomInput } from "@/core/helpers/vue/composables/form";
import type { ISection } from "./Repetable.vue";
import useForm from "@/core/helpers/vue/composables/form";
import Icon from "../../Icon.vue";

interface RepetableSectionProps {
  value: ISection;
  orderable?: boolean;
}

const props = withDefaults(defineProps<RepetableSectionProps>(), {});
const emit = defineEmits(["inputChange"]);

useForm({
  modelValue: props.value,
});
</script>

<style lang="scss">
.repetable-section {
  background-color: #fafafa;
  display: flex;
  align-items: center;
  gap: spacing(2);
  > *:last-child {
    flex-grow: 1;
  }
  .drag_handle {
    cursor: grab;
  }
}
</style>
