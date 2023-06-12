<template>
    <div class="w-full h-px b border-t border-transparent border-dashed border-t-slate-400" :class="{ '-px-8': padding }" />
</template>

<script lang="ts" setup>

type CardDividerProps = {
    padding?: boolean;
}

const props = withDefaults(defineProps<CardDividerProps>(), {});

</script>