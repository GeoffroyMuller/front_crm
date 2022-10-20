<template>
  <div></div>
</template>
<script setup lang="ts">
interface FlexProps {
  direction?: "row" | "column";
  alignItems?:
    | "center"
    | "flex-start"
    | "flex-end"
    | "start"
    | "end"
    | "baseline"
    | "stretch";
  justifyContent?:
    | "center"
    | "space-between"
    | "space-around"
    | "space-evenly"
    | "flex-start"
    | "flex-end"
    | "start"
    | "end"
    | "stretch";
  gap: number;
}

const props = withDefaults(defineProps<FlexProps>(), {});
</script>
