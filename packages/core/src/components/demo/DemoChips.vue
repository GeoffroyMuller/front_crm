<template>
  <div class="flex gap-2">
    <Chip
      text="blabla"
      v-for="color of [
        'success',
        'primary',
        'danger',
        'warning',
        'white',
        'black',
        undefined,
      ]"
      :key="color"
      :color="color"
      icon="mail"
      is-closable
    />
  </div>
  <div class="flex gap-2">
    <Chip
      text="blabla"
      v-for="color of [
        'success',
        'primary',
        'danger',
        'warning',
        'white',
        'black',
        undefined,
      ]"
      :key="color"
      :color="color"
      icon="mail"
      is-closable
      is-outline
    />
  </div>
</template>

<script lang="ts" setup>
import Chip from "../Chip.vue";
</script>
