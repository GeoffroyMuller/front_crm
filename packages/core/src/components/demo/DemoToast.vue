<template>
    <div class="flex gap-2">
        <Button color="success" @click="() => handleClick('success')">Success</Button>
        <Button color="danger" @click="() => handleClick('danger')">Danger</Button>
        <Button color="warning" @click="() => handleClick('warning')">Warning</Button>
        <Button color="primary" @click="() => handleClick('info')">Info</Button>
    </div>
</template>
<script setup lang="ts">
import useUI from '../../composables/ui';
import Button from '../Button.vue';
import type { Notification } from '../types';

const { toast } = useUI()

function handleClick(type: Notification['type']) {
    toast({
        message: 'Hello world !',
        type: type
    });
}

</script>