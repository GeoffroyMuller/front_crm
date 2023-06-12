<template>
    <CardContent>
        <div v-if="title" class="typo-title5 typo-bold">
            {{ title }}
        </div>
        <div class="typo-title6" v-if="subtitle">
            {{ subtitle  }}
        </div>

        <slot />
    </CardContent>
</template>

<script setup lang="ts">
import CardContent from "./CardContent.vue";

export interface CardHeadProps {
    title?: string;
    subtitle?: string;
}

withDefaults(defineProps<CardHeadProps>(), {});
</script>