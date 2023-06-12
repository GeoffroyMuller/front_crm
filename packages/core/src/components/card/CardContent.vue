<template>
    <div :class="{ 'py-5 px-8': !card?.padding }">
        <slot />
    </div>
</template>

<script setup lang="ts">
import { inject } from 'vue';
import type { CardProvide } from './Card.vue';

const card = inject<CardProvide>('card');
</script>