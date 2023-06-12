<template>
    <div class="flex gap-2">
        <Chip text="blabla" color="success" icon="mail" />
        <Chip text="blabla" color="black" icon="mail" />
        <Chip text="blabla" color="danger" icon="mail" />
        <Chip text="blabla" color="primary" icon="mail" />
        <Chip text="blabla" color="warning" icon="mail" />
    </div>
    <div class="flex gap-2">
        <Chip text="blabla" color="success" icon="mail" is-closable />
        <Chip text="blabla" color="black" icon="mail" is-closable />
        <Chip text="blabla" color="danger" icon="mail" is-closable />
        <Chip text="blabla" color="primary" icon="mail" is-closable />
        <Chip text="blabla" color="warning" icon="mail" is-closable />
    </div>
    <div class="flex gap-2">
        <Chip text="blabla" color="success" icon="mail" is-outline />
        <Chip text="blabla" color="black" icon="mail" is-outline />
        <Chip text="blabla" color="danger" icon="mail" is-outline />
        <Chip text="blabla" color="primary" icon="mail" is-outline />
        <Chip text="blabla" color="warning" icon="mail" is-outline />
    </div>
    <div class="flex gap-2">
        <Chip text="blabla" color="success" icon="mail" is-outline is-closable />
        <Chip text="blabla" color="black" icon="mail" is-outline is-closable />
        <Chip text="blabla" color="danger" icon="mail" is-outline is-closable />
        <Chip text="blabla" color="primary" icon="mail" is-outline is-closable />
        <Chip text="blabla" color="warning" icon="mail" is-outline is-closable />
    </div>
</template>

<script lang="ts" setup>
import Chip from "../Chip.vue";
</script>