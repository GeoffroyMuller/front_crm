<template>
  <div class="flex flex-wrap gap-2">
    <Input type="number" />
    <Input type="number" appearance-none />
    <Input icon="verified_user" />
    <Input icon="verified_user" error="sqdqs" />
    <Input icon="home" disabled />
  </div>
</template>

<script setup lang="ts">
import Input from "../form/Input.vue";
</script>
