<template>
    <div class="page-content" :class="[
        {
            'padding-light': padding === 'light',
            'padding-large': padding === 'large',
        },
    ]">
        <slot />
    </div>
</template>

<script setup lang="ts">
export type PageContentProps = {
    padding?: null | 'light' | 'large';
}
defineProps<PageContentProps>();
</script>
